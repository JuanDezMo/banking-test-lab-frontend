import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jsonResponse, mockFetch, renderWithProviders } from '@/test/utils'
import { RegisterForm } from './RegisterForm'

async function fillForm(values: { name: string; email: string; password: string }) {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Full name'), values.name)
  await user.type(screen.getByLabelText('Email'), values.email)
  await user.type(screen.getByLabelText('Password'), values.password)
  await user.click(screen.getByRole('button', { name: 'Create account' }))
}

const valid = { name: 'Ana Pérez', email: 'ana@mail.com', password: 'S3gura2026' }

describe('RegisterForm', () => {
  it('shows client validation errors without calling the API', async () => {
    const fetchMock = mockFetch()
    renderWithProviders(<RegisterForm onSuccess={vi.fn()} />)

    await fillForm({ name: ' ', email: 'ana', password: '123' })

    expect(await screen.findByText('Invalid name')).toBeInTheDocument()
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    expect(screen.getByText('Password too short')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('calls onSuccess with the created user', async () => {
    const createdUser = {
      id: '1',
      ...valid,
      role: 'customer',
      createdAt: '2026-11-10T00:00:00.000Z',
    }
    mockFetch(jsonResponse(createdUser, 201))
    const onSuccess = vi.fn()
    renderWithProviders(<RegisterForm onSuccess={onSuccess} />)

    await fillForm(valid)

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    expect(onSuccess.mock.calls[0]?.[0]).toEqual(createdUser)
  })

  it('shows the 409 conflict as a general alert', async () => {
    mockFetch(
      jsonResponse({ code: 'EMAIL_ALREADY_REGISTERED', message: 'Email already registered' }, 409),
    )
    renderWithProviders(<RegisterForm onSuccess={vi.fn()} />)

    await fillForm(valid)

    expect(await screen.findByTestId('register-error-alert')).toHaveTextContent(
      'Email already registered',
    )
  })

  it('shows a backend 400 under its field', async () => {
    mockFetch(jsonResponse({ code: 'BAD_REQUEST', message: 'Invalid email' }, 400))
    renderWithProviders(<RegisterForm onSuccess={vi.fn()} />)

    await fillForm(valid)

    expect(await screen.findByText('Invalid email')).toHaveAttribute('id', 'register-email-error')
  })
})
