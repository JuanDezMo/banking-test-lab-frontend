import { jsonResponse, mockFetch } from '@/test/utils'
import { ApiError } from './ApiError'
import { httpClient, request } from './httpClient'

describe('httpClient', () => {
  it('returns the parsed JSON on success', async () => {
    const fetchMock = mockFetch(jsonResponse({ id: '1' }, 201))

    const data = await httpClient.post<{ id: string }>('/auth/register', { name: 'Ana' })

    expect(data).toEqual({ id: '1' })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('/api/auth/register')
    expect(init?.method).toBe('POST')
    expect(init?.body).toBe('{"name":"Ana"}')
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' })
  })

  it('builds the query string and skips undefined values', async () => {
    const fetchMock = mockFetch(jsonResponse({ items: [] }))

    await httpClient.get('/accounts/1/movements', { query: { page: 2, filter: undefined } })

    expect(fetchMock.mock.calls[0]![0]).toBe('/api/accounts/1/movements?page=2')
  })

  it('returns undefined on 204 No Content', async () => {
    mockFetch(new Response(null, { status: 204 }))

    await expect(request('/auth/logout', { method: 'POST' })).resolves.toBeUndefined()
  })

  it('throws ApiError with the backend code and message', async () => {
    mockFetch(
      jsonResponse({ code: 'EMAIL_ALREADY_REGISTERED', message: 'Email already registered' }, 409),
    )

    const error = await httpClient.post('/auth/register', {}).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 409,
      code: 'EMAIL_ALREADY_REGISTERED',
      message: 'Email already registered',
    })
  })

  it('reads Retry-After on 429', async () => {
    mockFetch(
      jsonResponse({ code: 'TOO_MANY_REQUESTS', message: 'Too many login attempts' }, 429, {
        'Retry-After': '120',
      }),
    )

    const error = await httpClient.post('/auth/login', {}).catch((e: unknown) => e)

    expect(error).toMatchObject({ code: 'TOO_MANY_REQUESTS', retryAfter: 120 })
  })

  it('maps a non JSON error body to UNKNOWN_ERROR', async () => {
    mockFetch(new Response('Bad gateway', { status: 502 }))

    const error = await httpClient.get('/accounts').catch((e: unknown) => e)

    expect(error).toMatchObject({ status: 502, code: 'UNKNOWN_ERROR' })
  })

  it('maps a network failure to NETWORK_ERROR', async () => {
    const fetchMock = mockFetch()
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    const error = await httpClient.get('/accounts').catch((e: unknown) => e)

    expect(error).toMatchObject({ status: 0, code: 'NETWORK_ERROR' })
  })
})
