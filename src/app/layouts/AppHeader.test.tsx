import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AppHeader } from './AppHeader'

// Renderiza el header dentro de un router en memoria
function renderHeader() {
  return render(
    <MemoryRouter>
      <AppHeader />
    </MemoryRouter>,
  )
}

describe('AppHeader', () => {
  it('shows the brand logo and main navigation', () => {
    renderHeader()

    expect(screen.getByAltText('Bank Lab logo')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByTestId('nav-home')).toHaveAttribute('aria-current', 'page')
  })

  it('opens the mobile menu', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument()
  })
})
