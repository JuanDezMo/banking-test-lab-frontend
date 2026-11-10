import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'
import { jsonResponse, mockFetch, renderWithProviders } from '@/test/utils'
import { CreateAccountDialog } from './CreateAccountDialog'

const created = {
  id: '6f1c0000-0000-4000-8000-000000000001',
  accountNumber: '0012345678',
  accountType: 'checking',
  balance: 0,
  createdAt: '2026-11-10T14:30:00.000Z',
}

function renderDialog(onCreated = vi.fn()) {
  renderWithProviders(<CreateAccountDialog onCreated={onCreated} trigger={<Button>Open</Button>} />)
  return { user: userEvent.setup(), onCreated }
}

describe('CreateAccountDialog', () => {
  it('requires an account type', async () => {
    const fetchMock = mockFetch()
    const { user } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(screen.getByRole('button', { name: 'Open account' }))

    expect(await screen.findByText('Choose an account type')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('creates a checking account and closes', async () => {
    const fetchMock = mockFetch(jsonResponse(created, 201), jsonResponse({ items: [created] }))
    const { user, onCreated } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(screen.getByRole('radio', { name: /Checking/ }))
    await user.click(screen.getByRole('button', { name: 'Open account' }))

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(created))
    expect(fetchMock.mock.calls[0]![1]?.body).toBe('{"accountType":"checking"}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the API error inside the dialog', async () => {
    mockFetch(jsonResponse({ code: 'FORBIDDEN', message: 'Access denied' }, 403))
    const { user } = renderDialog()

    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(screen.getByRole('radio', { name: /Savings/ }))
    await user.click(screen.getByRole('button', { name: 'Open account' }))

    expect(await screen.findByTestId('create-account-error-alert')).toHaveTextContent(
      'Access denied',
    )
  })
})
