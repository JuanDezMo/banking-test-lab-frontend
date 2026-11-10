import { isApiError } from '@/lib/http/ApiError'

// Mensajes de validación (400) del backend y el campo de formulario al que pertenecen.
// Los demás errores se muestran como alerta general del formulario.
const fieldByMessage: Record<string, string> = {
  'Invalid name': 'name',
  'Invalid email': 'email',
  'Password too short': 'password',
  'Password too long': 'password',
}

export type FieldError = {
  field: string
  message: string
}

// Si el error corresponde a un campo de formulario, devuelve el campo y el mensaje
export function getFieldError(error: unknown): FieldError | null {
  if (!isApiError(error) || error.code !== 'BAD_REQUEST') return null
  const field = fieldByMessage[error.message]
  return field ? { field, message: error.message } : null
}

// Mensaje legible para cualquier error (los del backend ya vienen en inglés)
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message
  return 'Something went wrong. Please try again.'
}
