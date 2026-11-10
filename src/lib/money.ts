import { moneyConfig } from '@/config/money'

const formatter = new Intl.NumberFormat(moneyConfig.locale, {
  style: 'currency',
  currency: moneyConfig.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// Centavos enteros → texto con formato: 150000 → "$1,500.00", -32000 → "-$320.00"
export function formatCents(cents: number): string {
  // Se divide solo para mostrar; la lógica siempre trabaja con enteros
  return formatter.format(cents / 100)
}

// Separa un monto formateado en parte entera y decimales: "$12,480" y ".50"
export function splitFormattedCents(cents: number): { whole: string; fraction: string } {
  const text = formatCents(cents)
  const dot = text.lastIndexOf('.')
  return dot === -1
    ? { whole: text, fraction: '' }
    : { whole: text.slice(0, dot), fraction: text.slice(dot) }
}

// Patrón de un monto escrito por el usuario: dígitos, comas de miles opcionales y hasta 2 decimales
const amountPattern = /^(\d{1,3}(,\d{3})*|\d+)(\.\d{1,2})?$/

// Texto del usuario → centavos enteros, procesando el texto (sin multiplicar floats).
// "1,500.5" → 150050. Devuelve null si el texto no es un monto válido.
export function parseToCents(input: string): number | null {
  const text = input.trim().replace(/^\$/, '')
  if (!amountPattern.test(text)) return null

  const [wholePart = '0', fractionPart = ''] = text.replace(/,/g, '').split('.')
  const cents = Number(wholePart) * 100 + Number(fractionPart.padEnd(2, '0'))
  return Number.isSafeInteger(cents) ? cents : null
}
