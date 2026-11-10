import type { components } from '@/lib/api-types'

// Modelos del dominio de cuentas (tipos generados desde openapi.yaml)
export type Account = components['schemas']['Account']
export type AccountType = components['schemas']['AccountType']
export type CreateAccountInput = components['schemas']['CreateAccountRequest']

// Etiquetas legibles por tipo de cuenta
export const accountTypeLabels: Record<AccountType, string> = {
  savings: 'Savings',
  checking: 'Checking',
}

// Contrato del acceso a datos de cuentas
export interface AccountRepository {
  list(): Promise<Account[]>
  getById(id: string): Promise<Account>
  create(input: CreateAccountInput): Promise<Account>
}
