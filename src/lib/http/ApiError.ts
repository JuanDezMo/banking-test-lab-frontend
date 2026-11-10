import type { components } from '@/lib/api-types'

// Códigos que devuelve el backend más dos propios del cliente
export type BackendErrorCode = components['schemas']['Error']['code']
export type ApiErrorCode = BackendErrorCode | 'NETWORK_ERROR' | 'UNKNOWN_ERROR'

type ApiErrorParams = {
  status: number
  code: ApiErrorCode
  message: string
  retryAfter?: number
}

// Error tipado que reciben las capas superiores; nunca ven la Response cruda
export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  // Segundos a esperar (solo en 429, desde el header Retry-After)
  readonly retryAfter?: number

  constructor({ status, code, message, retryAfter }: ApiErrorParams) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.retryAfter = retryAfter
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
