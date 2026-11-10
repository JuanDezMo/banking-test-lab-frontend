import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jsonResponse, mockFetch, renderWithProviders } from '@/test/utils'
import { RechargeForm } from './RechargeForm'

const movement = {
  id: 'a41e0000-0000-4000-8000-000000000001',
  accountId: '6f1c0000-0000-4000-8000-000000000001',
  movementType: 'recharge',
  amount: 150000,
  details: { rechargeType: 'salary' },
  createdAt: '2026-11-10T14:30:00.000Z',
}

async function fill(user: ReturnType<typeof userEvent.setup>, type: RegExp, amount: string) {
  await user.type(screen.getByLabelText('Account number'), '0012345678')
  await user.click(screen.getByRole('radio', { name: type }))
  await user.type(screen.getByLabelText('Amount'), amount)
  await user.click(screen.getByRole('button', { name: 'Recharge account' }))
}

const keyOf = (fetchMock: ReturnType<typeof mockFetch>, call: number) =>
  (fetchMock.mock.calls[call]![1]?.headers as Record<string, string>)['Idempotency-Key']

describe('RechargeForm', () => {
  it('validates the fields', async () => {
    const fetchMock = mockFetch()
    renderWithProviders(<RechargeForm />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Recharge account' }))

    expect(await screen.findByText('Invalid account number')).toBeInTheDocument()
    expect(screen.getByText('Choose a recharge type')).toBeInTheDocument()
    expect(screen.getByText('Enter an amount')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('warns about the cash limit without blocking', async () => {
    renderWithProviders(<RechargeForm />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('radio', { name: /Cash/ }))
    await user.type(screen.getByLabelText('Amount'), '3000.01')

    expect(screen.getByTestId('recharge-amount-hint')).toHaveTextContent('above $3,000.00')
    expect(screen.getByRole('button', { name: 'Recharge account' })).toBeEnabled()
  })

  it('recharges and shows the receipt', async () => {
    const fetchMock = mockFetch(jsonResponse(movement, 201))
    renderWithProviders(<RechargeForm />)
    await fill(userEvent.setup(), /Salary/, '1500')

    expect(await screen.findByTestId('recharge-receipt')).toBeInTheDocument()
    expect(screen.getByTestId('receipt-amount')).toHaveTextContent('$1,500.00')
    expect(screen.getByRole('link', { name: 'View account' })).toHaveAttribute(
      'href',
      `/operator/accounts/${movement.accountId}`,
    )
    expect(fetchMock.mock.calls[0]![1]?.body).toBe(
      '{"accountNumber":"0012345678","rechargeType":"salary","amount":150000}',
    )
    expect(keyOf(fetchMock, 0)).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('shows the business error and reuses the key when retrying the same values', async () => {
    const fetchMock = mockFetch(
      jsonResponse({ code: 'CASH_LIMIT_EXCEEDED', message: 'Cash recharge limit exceeded' }, 422),
      jsonResponse({ code: 'CASH_LIMIT_EXCEEDED', message: 'Cash recharge limit exceeded' }, 422),
    )
    renderWithProviders(<RechargeForm />)
    const user = userEvent.setup()
    await fill(user, /Cash/, '5000')

    expect(await screen.findByTestId('recharge-error-alert')).toHaveTextContent(
      'Cash recharge limit exceeded',
    )
    await user.click(screen.getByRole('button', { name: 'Recharge account' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(keyOf(fetchMock, 1)).toBe(keyOf(fetchMock, 0))
  })

  it('uses a new key when the values change', async () => {
    const error = () => jsonResponse({ code: 'NOT_FOUND', message: 'Account not found' }, 404)
    const fetchMock = mockFetch(error(), error())
    renderWithProviders(<RechargeForm />)
    const user = userEvent.setup()
    await fill(user, /Salary/, '10')

    await screen.findByTestId('recharge-error-alert')
    await user.type(screen.getByLabelText('Amount'), '0')
    await user.click(screen.getByRole('button', { name: 'Recharge account' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(keyOf(fetchMock, 1)).not.toBe(keyOf(fetchMock, 0))
  })
})
