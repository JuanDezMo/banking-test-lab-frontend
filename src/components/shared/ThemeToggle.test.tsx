import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('switches to dark mode and stores the choice', async () => {
    // jsdom no implementa matchMedia (next-themes lo usa para el tema del sistema)
    window.matchMedia ??= ((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia

    render(
      <ThemeProvider attribute="class" storageKey="btl-theme" defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>,
    )
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Change theme' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }))

    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('btl-theme')).toBe('dark')
  })
})
