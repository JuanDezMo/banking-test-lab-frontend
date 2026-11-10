import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jsonResponse, mockFetch, renderWithProviders } from '@/test/utils'
import type { Account } from '@/features/accounts/types'
import { TransferForm } from './TransferForm'

const accounts: Account[] = [
  {
    id: 'a1',
    accountNumber: '0012345678',
    accountType: 'savings',
    balance: 100000,
    createdAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'a2',
    accountNumber: '0012345679',
    accountType: 'checking',
    balance: 0,
    createdAt: '2026-11-02T00:00:00.000Z',
  },
]
const movement = (type: string, accountId: string) => ({
  id: `m-${type}`,
  accountId,
  movementType: type,
  amount: 2500,
  details: { relatedAccountId: 'x' },
  createdAt: '2026-11-10T14:35:00.000Z',
})
const result = {
  transferOut: movement('transfer_out', 'a1'),
  transferIn: movement('transfer_in', 'a2'),
}

async function fillAndReview(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('destination-chip-0012345679'))
  await user.type(screen.getByLabelText('Amount'), '25')
  await user.click(screen.getByRole('button', { name: 'Review transfer' }))
}

describe('TransferForm', () => {
  it('shows a live preview of the transfer', async () => {
    renderWithProviders(<TransferForm accounts={accounts} onSuccess={vi.fn()} />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Amount'), '250.75')

    expect(screen.getByTestId('preview-amount')).toHaveTextContent('$250.75')
    expect(screen.getByTestId('preview-balance-after')).toHaveTextContent('$749.25')
  })

  it('reviews and confirms with an Idempotency-Key', async () => {
    const fetchMock = mockFetch(jsonResponse(result, 201))
    const onSuccess = vi.fn()
    renderWithProviders(<TransferForm accounts={accounts} onSuccess={onSuccess} />)
    const user = userEvent.setup()

    await fillAndReview(user)
    expect(screen.getByTestId('summary-amount')).toHaveTextContent('$25.00')
    await user.click(screen.getByRole('button', { name: 'Confirm transfer' }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('/api/transfers')
    expect(init?.body).toBe(
      '{"accountOrigin":"0012345678","accountDestination":"0012345679","amount":2500}',
    )
    const headers = init?.headers as Record<string, string>
    expect(headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('reuses the same key when retrying after an error', async () => {
    const fetchMock = mockFetch(
      jsonResponse(
        {
          code: 'IDEMPOTENCY_REQUEST_IN_PROGRESS',
          message: 'Request with this idempotency key is in progress',
        },
        409,
      ),
      jsonResponse(result, 201),
    )
    renderWithProviders(<TransferForm accounts={accounts} onSuccess={vi.fn()} />)
    const user = userEvent.setup()

    await fillAndReview(user)
    await user.click(screen.getByRole('button', { name: 'Confirm transfer' }))
    expect(await screen.findByTestId('transfer-error-alert')).toHaveTextContent('in progress')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    const key = (call: number) =>
      (fetchMock.mock.calls[call]![1]?.headers as Record<string, string>)['Idempotency-Key']
    expect(key(1)).toBe(key(0))
  })

  it('shows insufficient funds from the API', async () => {
    mockFetch(jsonResponse({ code: 'INSUFFICIENT_FUNDS', message: 'Insufficient funds' }, 422))
    renderWithProviders(<TransferForm accounts={accounts} onSuccess={vi.fn()} />)
    const user = userEvent.setup()

    await fillAndReview(user)
    await user.click(screen.getByRole('button', { name: 'Confirm transfer' }))

    expect(await screen.findByTestId('transfer-error-alert')).toHaveTextContent(
      'Insufficient funds',
    )
  })

  it('validates before reviewing', async () => {
    const fetchMock = mockFetch()
    renderWithProviders(<TransferForm accounts={accounts} onSuccess={vi.fn()} />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('To account number'), '0012345678')
    await user.click(screen.getByRole('button', { name: 'Review transfer' }))

    expect(await screen.findByText('Cannot transfer to the same account')).toBeInTheDocument()
    expect(screen.getByText('Enter an amount')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
