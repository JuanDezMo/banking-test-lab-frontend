import type { Account } from '../types'
import { availableBalance, totalBalance } from '../balance'
import { createAccountService } from './accountService'

const account = (overrides: Partial<Account>): Account => ({
  id: 'id',
  accountNumber: '0012345678',
  accountType: 'savings',
  balance: 0,
  createdAt: '2026-11-10T00:00:00.000Z',
  ...overrides,
})

describe('accountService', () => {
  it('adds the overdraft only to checking accounts', () => {
    expect(availableBalance(account({ accountType: 'savings', balance: 1000 }))).toBe(1000)
    expect(availableBalance(account({ accountType: 'checking', balance: -32000 }))).toBe(468000)
  })

  it('sums the balances', () => {
    expect(totalBalance([account({ balance: 1248050 }), account({ balance: -32000 })])).toBe(
      1216050,
    )
    expect(totalBalance([])).toBe(0)
  })

  it('delegates to the repository', async () => {
    const fake = { list: vi.fn().mockResolvedValue([]), getById: vi.fn(), create: vi.fn() }
    await createAccountService(fake).list()
    expect(fake.list).toHaveBeenCalled()
  })
})
