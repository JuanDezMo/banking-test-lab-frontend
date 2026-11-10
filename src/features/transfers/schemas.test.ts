import { transferSchema } from './schemas'
import { toTransferRequest } from './services/transferService'

const valid = { accountOrigin: '0012345678', accountDestination: '0098765432', amount: '150.50' }

function errorFor(input: Partial<typeof valid>, field: string) {
  const result = transferSchema.safeParse({ ...valid, ...input })
  return result.success ? undefined : result.error.issues.find((i) => i.path[0] === field)?.message
}

describe('transferSchema', () => {
  it('accepts a valid transfer and converts the amount to cents', () => {
    expect(toTransferRequest(transferSchema.parse(valid))).toEqual({
      accountOrigin: '0012345678',
      accountDestination: '0098765432',
      amount: 15050,
    })
  })

  it.each([
    [{ accountDestination: '12345' }, 'accountDestination', 'Invalid account number'],
    [
      { accountDestination: '0012345678' },
      'accountDestination',
      'Cannot transfer to the same account',
    ],
    [{ amount: '' }, 'amount', 'Enter an amount'],
    [{ amount: 'abc' }, 'amount', 'Enter a valid amount, e.g. 150.00'],
    [{ amount: '0' }, 'amount', 'Amount must be greater than zero'],
    [{ amount: '10000000000.01' }, 'amount', 'Amount exceeds maximum'],
  ])('rejects %o', (input, field, message) => {
    expect(errorFor(input, field)).toBe(message)
  })
})
