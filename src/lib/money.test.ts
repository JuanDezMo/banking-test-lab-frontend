import { formatCents, parseToCents, splitFormattedCents } from './money'

describe('formatCents', () => {
  it.each([
    [0, '$0.00'],
    [5, '$0.05'],
    [150000, '$1,500.00'],
    [-32000, '-$320.00'],
    [1_000_000_000_000, '$10,000,000,000.00'],
  ])('formats %i as %s', (cents, text) => {
    expect(formatCents(cents)).toBe(text)
  })

  it('splits whole and fraction parts', () => {
    expect(splitFormattedCents(1248050)).toEqual({ whole: '$12,480', fraction: '.50' })
  })
})

describe('parseToCents', () => {
  it.each([
    ['1500', 150000],
    ['1,500.5', 150050],
    ['$0.01', 1],
    [' 12.34 ', 1234],
    ['0.1', 10],
    // Caso clásico de error con floats: 0.29 * 100 = 28.999999999999996
    ['0.29', 29],
  ])('parses "%s" as %i cents', (text, cents) => {
    expect(parseToCents(text)).toBe(cents)
  })

  it.each(['', 'abc', '1.234', '-5', '1,50', '1e3', '12.'])('rejects "%s"', (text) => {
    expect(parseToCents(text)).toBeNull()
  })
})
