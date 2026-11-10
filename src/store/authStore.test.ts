import { fakeTokens } from '@/test/utils'
import { selectIsAuthenticated, useAuthStore } from './authStore'

describe('authStore', () => {
  it('stores the session with the role taken from the token', () => {
    useAuthStore.getState().setSession(fakeTokens('operator'), 'op@bank.local')

    const state = useAuthStore.getState()
    expect(state.user).toMatchObject({ role: 'operator', email: 'op@bank.local' })
    expect(selectIsAuthenticated(state)).toBe(true)
  })

  it('persists the session in sessionStorage', () => {
    useAuthStore.getState().setSession(fakeTokens(), 'ana@mail.com')
    expect(sessionStorage.getItem('btl-session')).toContain('ana@mail.com')
  })

  it('replaces tokens and keeps the user on update', () => {
    useAuthStore.getState().setSession(fakeTokens(), 'ana@mail.com')
    useAuthStore.getState().updateTokens(fakeTokens('customer', 'refresh-2'))

    expect(useAuthStore.getState().refreshToken).toBe('refresh-2')
    expect(useAuthStore.getState().user?.email).toBe('ana@mail.com')
  })

  it('ignores an invalid access token', () => {
    useAuthStore.getState().setSession({ ...fakeTokens(), accessToken: 'broken' }, 'ana@mail.com')
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false)
  })

  it('clears the session', () => {
    useAuthStore.getState().setSession(fakeTokens(), 'ana@mail.com')
    useAuthStore.getState().clear()
    expect(useAuthStore.getState().user).toBeNull()
  })
})
