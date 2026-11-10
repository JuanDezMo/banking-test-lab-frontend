import { env } from '@/config/env'
import { useAuthStore } from '@/store/authStore'
import { ApiError, type ApiErrorCode } from './ApiError'
import { refreshAccessToken } from './tokenRefresh'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type QueryParams = Record<string, string | number | undefined>

export type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  query?: QueryParams
  headers?: Record<string, string>
  signal?: AbortSignal
  // false en endpoints públicos (registro, login): no envía Bearer ni intenta refresh
  auth?: boolean
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

// Hace una petición con fetch; devuelve la Response o lanza ApiError de red
async function send(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init)
  } catch (error) {
    // Una cancelación no es un error de red: se propaga tal cual
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError({ status: 0, code: 'NETWORK_ERROR', message: 'Unable to reach the server' })
  }
}

// Función base: hace la petición con fetch y devuelve el JSON tipado o lanza ApiError
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, headers = {}, signal, auth = true } = options
  const url = buildUrl(path, query)

  // Arma los headers con el token indicado (o sin Authorization si no hay)
  const buildInit = (accessToken: string | null): RequestInit => {
    const finalHeaders: Record<string, string> = { Accept: 'application/json', ...headers }
    if (body !== undefined) finalHeaders['Content-Type'] = 'application/json'
    if (auth && accessToken) finalHeaders.Authorization = `Bearer ${accessToken}`
    return {
      method,
      signal,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }
  }

  let response = await send(url, buildInit(useAuthStore.getState().accessToken))

  if (!response.ok) {
    let error = await toApiError(response)

    // Access token vencido: se renueva una vez y se repite la petición original
    if (auth && error.code === 'UNAUTHORIZED') {
      const newToken = await refreshAccessToken()
      if (newToken) {
        response = await send(url, buildInit(newToken))
        if (response.ok) return parseBody<T>(response)
        error = await toApiError(response)
      }
    }
    throw error
  }

  return parseBody<T>(response)
}

// 204 No Content no tiene cuerpo; el resto se lee como JSON
async function parseBody<T>(response: Response): Promise<T> {
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
