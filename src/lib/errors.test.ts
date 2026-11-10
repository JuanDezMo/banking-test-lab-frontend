import { getErrorMessage, getFieldError } from './errors'
import { ApiError } from './http/ApiError'

const badRequest = (message: string) => new ApiError({ status: 400, code: 'BAD_REQUEST', message })

describe('getFieldError', () => {
  it.each([
    ['Invalid name', 'name'],
    ['Invalid email', 'email'],
    ['Password too short', 'password'],
    ['Password too long', 'password'],
  ])('maps "%s" to the %s field', (message, field) => {
    expect(getFieldError(badRequest(message))).toEqual({ field, message })
  })

  it('returns null for messages without a field', () => {
    expect(getFieldError(badRequest('Invalid request body'))).toBeNull()
  })

  it('returns null for non validation errors', () => {
    const conflict = new ApiError({
      status: 409,
      code: 'EMAIL_ALREADY_REGISTERED',
      message: 'Email already registered',
    })
    expect(getFieldError(conflict)).toBeNull()
    expect(getFieldError(new Error('boom'))).toBeNull()
  })
})

describe('getErrorMessage', () => {
  it('uses the API message', () => {
    expect(getErrorMessage(badRequest('Invalid email'))).toBe('Invalid email')
  })

  it('uses a generic message for unknown errors', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('Something went wrong. Please try again.')
  })
})
