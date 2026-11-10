import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jsonResponse, mockFetch, renderWithProviders } from '@/test/utils'
import { AccountsPage } from './AccountsPage'

const savings = {
  id: '6f1c0000-0000-4000-8000-000000000001',
  accountNumber: '0012345678',
  accountType: 'savings',
  balance: 1248050,
  createdAt: '2026-11-02T10:00:00.000Z',
}
const checking = {
  id: '9a2d0000-0000-4000-8000-000000000002',
  accountNumber: '0012345679',
  accountType: 'checking',
  balance: -32000,
  createdAt: '2026-11-03T10:00:00.000Z',
}

describe('AccountsPage', () => {
  it('shows the empty state without accounts', async () => {
    mockFetch(jsonResponse({ items: [] }))
    renderWithProviders(<AccountsPage />)

    expect(
      await screen.findByRole('heading', { name: 'Open your first account' }),
    ).toBeInTheDocument()
  })

  it('shows the first account and the total balance', async () => {
    mockFetch(jsonResponse({ items: [savings, checking] }))
    renderWithProviders(<AccountsPage />)

    expect(await screen.findByTestId('selected-account-balance')).toHaveAttribute(
      'value',
      '1248050',
    )
    expect(screen.getByTestId('selected-account-number')).toHaveTextContent('0012 345 678')
    expect(screen.getByTestId('accounts-total-balance')).toHaveTextContent('$12,160.50')
  })

  it('switches the selected account', async () => {
    mockFetch(jsonResponse({ items: [savings, checking] }))
    renderWithProviders(<AccountsPage />)
    const user = userEvent.setup()

    const switcher = await screen.findByRole('group', { name: 'Select account' })
    await user.click(within(switcher).getByRole('button', { name: 'Checking' }))

    expect(within(switcher).getByRole('button', { name: 'Checking' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByTestId('selected-account-balance')).toHaveTextContent('-$320.00')
    expect(screen.getByTestId('selected-account-available')).toHaveTextContent('$4,680.00')
  })

  it('shows the error with a retry button', async () => {
    mockFetch(jsonResponse({ code: 'INTERNAL_ERROR', message: 'Internal error' }, 500))
    renderWithProviders(<AccountsPage />)

    expect(await screen.findByTestId('accounts-error-alert')).toHaveTextContent('Internal error')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
