import { env } from '@/config/env'
import { ApiError, type ApiErrorCode } from './ApiError'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type QueryParams = Record<string, string | number | undefined>

export type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  query?: QueryParams
  headers?: Record<string, string>
  signal?: AbortSignal
}

// Construye la URL final: prefijo de la API + ruta + query string
function buildUrl(path: string, query?: QueryParams): string {
  const url = `${env.apiBaseUrl}${path}`
  if (!query) return url

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value))
  }
  const search = params.toString()
  return search ? `${url}?${search}` : url
}

// Lee el header Retry-After como segundos (undefined si no existe o no es número)
function parseRetryAfter(response: Response): number | undefined {
  const value = response.headers.get('Retry-After')
  if (value === null) return undefined
  const seconds = Number(value)
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : undefined
}

function isErrorBody(body: unknown): body is { code: ApiErrorCode; message: string } {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as Record<string, unknown>).code === 'string' &&
    typeof (body as Record<string, unknown>).message === 'string'
  )
}

// Convierte una respuesta de error en ApiError con el formato { code, message } del backend
async function toApiError(response: Response): Promise<ApiError> {
  const body: unknown = await response.json().catch(() => null)
  const retryAfter = parseRetryAfter(response)

  if (isErrorBody(body)) {
    return new ApiError({
      status: response.status,
      code: body.code,
      message: body.message,
      retryAfter,
    })
  }
  return new ApiError({
    status: response.status,
    code: 'UNKNOWN_ERROR',
    message: 'Unexpected error',
    retryAfter,
  })
}

// Función base: hace la petición con fetch y devuelve el JSON tipado o lanza ApiError
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, headers = {}, signal } = options

  const init: RequestInit = {
    method,
    signal,
    headers: { Accept: 'application/json', ...headers },
  }
  if (body !== undefined) {
    init.headers = { ...init.headers, 'Content-Type': 'application/json' }
    init.body = JSON.stringify(body)
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), init)
  } catch (error) {
    // Una cancelación no es un error de red: se propaga tal cual
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError({ status: 0, code: 'NETWORK_ERROR', message: 'Unable to reach the server' })
  }

  if (!response.ok) throw await toApiError(response)

  // 204 No Content: no hay cuerpo que leer
  if (response.status === 204) return undefined as T

  return (await response.json()) as T
}

// Atajos por método HTTP
export const httpClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
}
