import type { components } from '@/lib/api-types'
import { httpClient } from '@/lib/http/httpClient'
import type { Account, AccountRepository, CreateAccountInput } from '../types'

type AccountList = components['schemas']['AccountList']

// Implementación HTTP del repositorio de cuentas
export const accountApi: AccountRepository = {
  list: async () => (await httpClient.get<AccountList>('/accounts')).items,
  getById: (id: string) => httpClient.get<Account>(`/accounts/${encodeURIComponent(id)}`),
  create: (input: CreateAccountInput) => httpClient.post<Account>('/accounts', input),
}
