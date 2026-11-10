import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jsonResponse, mockFetch, renderWithProviders } from '@/test/utils'
import { LoginForm } from './LoginForm'

async function submitLogin(email = 'ana@mail.com', password = 'wrong-pass') {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Sign in' }))
}

describe('LoginForm', () => {
  it('prefills the email', () => {
    renderWithProviders(<LoginForm defaultEmail="ana@mail.com" onSuccess={vi.fn()} />)
    expect(screen.getByLabelText('Email')).toHaveValue('ana@mail.com')
  })

  it('requires email and password', async () => {
    renderWithProviders(<LoginForm onSuccess={vi.fn()} />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('shows invalid credentials from the API', async () => {
    mockFetch(
      jsonResponse({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }, 401),
    )
    renderWithProviders(<LoginForm onSuccess={vi.fn()} />)

    await submitLogin()

    expect(await screen.findByTestId('login-error-alert')).toHaveTextContent(
      'Invalid email or password',
    )
  })

  it('locks the form with a countdown on 429', async () => {
    mockFetch(
      jsonResponse({ code: 'TOO_MANY_REQUESTS', message: 'Too many login attempts' }, 429, {
        'Retry-After': '75',
      }),
    )
    renderWithProviders(<LoginForm onSuccess={vi.fn()} />)

    await submitLogin()

    expect(await screen.findByTestId('login-lockout-alert')).toBeInTheDocument()
    expect(screen.getByRole('timer')).toHaveTextContent('1:15')
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
  })
})
