import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { fakeTokens } from '@/test/utils'
import { useAuthStore } from '@/store/authStore'
import { NotFoundPage } from './NotFoundPage'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NotFoundPage />
    </MemoryRouter>,
  )
}

describe('NotFoundPage', () => {
  it('shows the missing path and a link home for guests', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByTestId('not-found-path')).toHaveTextContent('/does-not-exist')
    expect(screen.getByRole('link', { name: 'Go to home' })).toHaveAttribute('href', '/')
  })

  it('links a signed in operator to the operator home', () => {
    useAuthStore.getState().setSession(fakeTokens('operator'), 'op@bank.local')
    renderAt('/nope')
    expect(screen.getByRole('link', { name: 'Back to my home' })).toHaveAttribute(
      'href',
      '/operator',
    )
  })
})
