import { loginSchema, registerSchema } from './schemas'

const valid = { name: 'Ana Pérez', email: 'ana@mail.com', password: 'S3gura2026' }

// Devuelve el primer mensaje de error de un campo, o undefined si es válido
function firstError(input: Record<string, string>, field: string) {
  const result = registerSchema.safeParse(input)
  if (result.success) return undefined
  return result.error.issues.find((issue) => issue.path[0] === field)?.message
}

describe('registerSchema', () => {
  it('accepts valid data and normalizes name and email', () => {
    const result = registerSchema.parse({ ...valid, name: '  Ana  ', email: ' ANA@Mail.com ' })
    expect(result).toEqual({ name: 'Ana', email: 'ana@mail.com', password: 'S3gura2026' })
  })

  it('does not trim the password', () => {
    expect(registerSchema.parse({ ...valid, password: ' secret  ' }).password).toBe(' secret  ')
  })

  it.each([
    ['empty name', { ...valid, name: '   ' }, 'name', 'Invalid name'],
    ['name over 100 chars', { ...valid, name: 'a'.repeat(101) }, 'name', 'Invalid name'],
    ['invalid email', { ...valid, email: 'ana@mail' }, 'email', 'Invalid email'],
    ['short password', { ...valid, password: '1234567' }, 'password', 'Password too short'],
    ['long password', { ...valid, password: 'a'.repeat(129) }, 'password', 'Password too long'],
  ])('rejects %s', (_case, input, field, message) => {
    expect(firstError(input, field)).toBe(message)
  })

  it('counts Unicode characters, not UTF-16 units', () => {
    // 100 emojis = 100 caracteres (200 unidades UTF-16): válido
    expect(firstError({ ...valid, name: '😀'.repeat(100) }, 'name')).toBeUndefined()
  })
})

describe('loginSchema', () => {
  it('requires email and password', () => {
    const result = loginSchema.safeParse({ email: '', password: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Email is required',
      'Password is required',
    ])
  })
})
