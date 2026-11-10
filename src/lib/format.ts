// Agrupa el número de cuenta de 10 dígitos para leerlo mejor: 0012345678 → 0012 345 678
export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3')
}
