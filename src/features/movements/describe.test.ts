import { describeMovement } from './describe'
import { toMovement } from './services/movementService'
import { signedAmount, type Movement } from './types'

const base = { id: 'm1', accountId: 'a1', amount: 40000, createdAt: '2026-11-10T14:35:00.000Z' }
const lookup = new Map([['own-2', '0012345679']])

describe('movements domain', () => {
  it.each<[Movement, number]>([
    [{ ...base, movementType: 'recharge', details: { rechargeType: 'salary' } }, 40000],
    [{ ...base, movementType: 'transfer_in', details: { relatedAccountId: 'x' } }, 40000],
    [{ ...base, movementType: 'transfer_out', details: { relatedAccountId: 'x' } }, -40000],
    [{ ...base, movementType: 'withdrawal', details: {} }, -40000],
  ])('signs %o', (movement, expected) => {
    expect(signedAmount(movement)).toBe(expected)
  })

  it('describes recharges by type', () => {
    expect(
      describeMovement(
        { ...base, movementType: 'recharge', details: { rechargeType: 'employer_bonus' } },
        lookup,
      ),
    ).toBe('Employer bonus')
  })

  it('shows the counterpart number for own accounts', () => {
    expect(
      describeMovement(
        { ...base, movementType: 'transfer_out', details: { relatedAccountId: 'own-2' } },
        lookup,
      ),
    ).toBe('To 0012 345 679')
  })

  it('hides accounts of other customers', () => {
    expect(
      describeMovement(
        { ...base, movementType: 'transfer_in', details: { relatedAccountId: 'foreign' } },
        lookup,
      ),
    ).toBe('From another customer')
  })

  it('maps the API DTO to the model', () => {
    expect(
      toMovement({ ...base, movementType: 'recharge', details: { rechargeType: 'cash' } }),
    ).toMatchObject({ details: { rechargeType: 'cash' } })
    expect(toMovement({ ...base, movementType: 'withdrawal' })).toMatchObject({ details: {} })
  })
})
