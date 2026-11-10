import { fakeJwt } from '@/test/utils'
import { decodeAccessToken } from './jwt'

describe('decodeAccessToken', () => {
  it('reads sub, role, iat and exp', () => {
    const token = fakeJwt({ sub: 'user-1', role: 'operator', exp: 123 })
    expect(decodeAccessToken(token)).toEqual({
      sub: 'user-1',
      role: 'operator',
      iat: 1_700_000_000,
      exp: 123,
    })
  })

  it.each(['', 'not-a-jwt', 'a.b.c', 'a.eyJmb28iOiJiYXIifQ.c'])(
    'returns null for "%s"',
    (token) => {
      expect(decodeAccessToken(token)).toBeNull()
    },
  )
})
