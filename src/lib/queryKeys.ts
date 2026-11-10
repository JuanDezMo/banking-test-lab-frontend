// Claves de caché de TanStack Query en un solo lugar.
// Viven en lib porque varias features las usan (por ejemplo, una transferencia
// invalida cuentas y movimientos) y las features no se importan entre sí.
export const queryKeys = {
  accounts: {
    all: ['accounts'] as const,
    detail: (id: string) => ['accounts', id] as const,
  },
  movements: {
    all: ['movements'] as const,
    page: (accountId: string, page: number) => ['movements', accountId, page] as const,
  },
}
