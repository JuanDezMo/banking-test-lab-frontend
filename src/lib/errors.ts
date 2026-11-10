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

// Si el error corresponde a un campo de formulario, devuelve el campo y el mensaje.
// Cada formulario puede pasar su propio mapa (el mismo mensaje puede ir a campos distintos).
export function getFieldError(
  error: unknown,
  map: Record<string, string> = fieldByMessage,
): FieldError | null {
  if (!isApiError(error) || error.code !== 'BAD_REQUEST') return null
  const field = map[error.message]
  return field ? { field, message: error.message } : null
}

// Mensaje legible para cualquier error (los del backend ya vienen en inglés)
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message
  return 'Something went wrong. Please try again.'
}
