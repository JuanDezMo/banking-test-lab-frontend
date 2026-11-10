import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AppLayout } from './AppLayout'

function renderLayout(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppLayout />
    </MemoryRouter>,
  )
}

describe('AppLayout', () => {
  it('shows the brand, the test environment badge and both navigations', () => {
    renderLayout()

    expect(screen.getAllByRole('img', { name: 'Banking Test Lab logo' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Test environment').length).toBeGreaterThan(0)
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument()
  })

  it('marks the current page in the navigation', () => {
    renderLayout('/login')

    const mainNav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(within(mainNav).getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(mainNav).getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })
})
