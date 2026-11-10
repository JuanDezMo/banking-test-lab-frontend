import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { fakeTokens } from '@/test/utils'
import { useAuthStore } from '@/store/authStore'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'

function renderRoutes(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<p>Login page</p>} />
        </Route>
        <Route element={<ProtectedRoute roles={['customer']} />}>
          <Route path="/accounts" element={<p>Accounts page</p>} />
        </Route>
        <Route element={<ProtectedRoute roles={['operator']} />}>
          <Route path="/operator" element={<p>Operator page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('route guards', () => {
  it('sends guests from a private page to login', () => {
    renderRoutes('/accounts')
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('lets a customer into customer pages', () => {
    useAuthStore.getState().setSession(fakeTokens('customer'), 'ana@mail.com')
    renderRoutes('/accounts')
    expect(screen.getByText('Accounts page')).toBeInTheDocument()
  })

  it('redirects a customer away from operator pages', () => {
    useAuthStore.getState().setSession(fakeTokens('customer'), 'ana@mail.com')
    renderRoutes('/operator')
    expect(screen.getByText('Accounts page')).toBeInTheDocument()
  })

  it('redirects a signed in operator from login to the operator home', () => {
    useAuthStore.getState().setSession(fakeTokens('operator'), 'op@bank.local')
    renderRoutes('/login')
    expect(screen.getByText('Operator page')).toBeInTheDocument()
  })
})
