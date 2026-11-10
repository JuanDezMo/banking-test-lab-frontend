import { fakeTokens, jsonResponse, mockFetch } from '@/test/utils'
import { useAuthStore } from '@/store/authStore'
import { httpClient } from './httpClient'

const unauthorized = () =>
  jsonResponse({ code: 'UNAUTHORIZED', message: 'Missing or invalid token' }, 401)

describe('httpClient token refresh', () => {
  beforeEach(() => {
    useAuthStore.getState().setSession(fakeTokens('customer', 'refresh-1'), 'ana@mail.com')
  })

  it('sends the Bearer token on protected requests', async () => {
    const fetchMock = mockFetch(jsonResponse({ items: [] }))
    await httpClient.get('/accounts')

    const headers = fetchMock.mock.calls[0]![1]?.headers as Record<string, string>
    expect(headers.Authorization).toBe(`Bearer ${useAuthStore.getState().accessToken}`)
  })

  it('does not send the token on public requests', async () => {
    const fetchMock = mockFetch(jsonResponse({}, 200))
    await httpClient.post('/auth/login', {}, { auth: false })

    const headers = fetchMock.mock.calls[0]![1]?.headers as Record<string, string>
    expect(headers.Authorization).toBeUndefined()
  })

  it('refreshes once on 401 and retries the original request', async () => {
    const newTokens = fakeTokens('customer', 'refresh-2')
    const fetchMock = mockFetch(
      unauthorized(),
      jsonResponse(newTokens),
      jsonResponse({ items: [1] }),
    )

    await expect(httpClient.get('/accounts')).resolves.toEqual({ items: [1] })

    expect(fetchMock.mock.calls[1]![0]).toBe('/api/auth/refresh')
    expect(fetchMock.mock.calls[1]![1]?.body).toBe('{"refreshToken":"refresh-1"}')
    expect(useAuthStore.getState().refreshToken).toBe('refresh-2')
  })

  it('shares a single refresh between concurrent requests', async () => {
    // Primera llamada de cada recurso: 401; con el token nuevo: 200
    const callsByUrl = new Map<string, number>()
    let refreshCalls = 0
    const fetchMock = vi.fn<typeof fetch>(async (input): Promise<Response> => {
      const url = String(input)
      if (url.endsWith('/auth/refresh')) {
        refreshCalls += 1
        return jsonResponse(fakeTokens('customer', 'refresh-2'))
      }
      const calls = (callsByUrl.get(url) ?? 0) + 1
      callsByUrl.set(url, calls)
      return calls === 1 ? unauthorized() : jsonResponse({ url })
    })
    vi.stubGlobal('fetch', fetchMock)

    await Promise.all([httpClient.get('/accounts'), httpClient.get('/accounts/1')])

    expect(refreshCalls).toBe(1)
  })

  it('clears the session when the refresh fails', async () => {
    mockFetch(
      unauthorized(),
      jsonResponse({ code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token' }, 401),
    )

    await expect(httpClient.get('/accounts')).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('does not refresh on invalid credentials', async () => {
    const fetchMock = mockFetch(
      jsonResponse({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }, 401),
    )

    await expect(httpClient.post('/auth/login', {}, { auth: false })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
