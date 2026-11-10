// Límites de negocio del backend (funcionalidades-y-errores.md), en centavos
export const limits = {
  // Sobregiro permitido por tipo de cuenta (RN-04, RN-05)
  overdraft: { savings: 0, checking: 500_000 },
  // Monto máximo de una operación (RN-30)
  maxAmount: 1_000_000_000_000,
  // Tope por recarga en efectivo (RN-08)
  cashRechargeMax: 300_000,
  // Tamaño fijo de página del historial (F-10)
  movementsPageSize: 20,
} as const
