import { limits } from '@/config/limits'
import type { Account } from './types'

// Reglas de dominio puras (sin React ni HTTP): las usan servicios y componentes

// Saldo disponible para operar: saldo + sobregiro permitido por tipo (RN-04, RN-05)
export function availableBalance(account: Account): number {
  return account.balance + limits.overdraft[account.accountType]
}

// Suma de saldos de todas las cuentas
export function totalBalance(accounts: Account[]): number {
  return accounts.reduce((sum, account) => sum + account.balance, 0)
}
