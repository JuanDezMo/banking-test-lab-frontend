import { accountApi } from '../api/accountApi'
import type { AccountRepository, CreateAccountInput } from '../types'

// Casos de uso de cuentas; el repositorio llega por parámetro (inversión de dependencias)
export function createAccountService(repository: AccountRepository) {
  return {
    list: () => repository.list(),
    getById: (id: string) => repository.getById(id),
    create: (input: CreateAccountInput) => repository.create(input),
  }
}

export const accountService = createAccountService(accountApi)
