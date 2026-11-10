import { useNavigate } from 'react-router'
import { operatorAccountPath } from '@/config/routes'
import { AccountLookup } from '@/features/accounts/components/AccountLookup'
import { RechargeForm } from '@/features/recharge/components/RechargeForm'
import { selectUser, useAuthStore } from '@/store/authStore'

// Inicio del operador: recargar cuentas (F-08) y consultar una cuenta por id (F-07)
export function OperatorPage() {
  const user = useAuthStore(selectUser)
  const navigate = useNavigate()

  return (
    <div className="operator-page grid gap-6" data-testid="operator-page">
      <header className="rounded-[32px] bg-inverse p-6 text-inverse-foreground sm:p-9">
        <p className="font-semibold text-inverse-muted">Operator · {user?.email}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Operations</h1>
        <p className="mt-3 max-w-xl text-inverse-muted">
          Recharge any customer account by its number, or look up an account by its id to review its
          balance and history.
        </p>
      </header>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:items-start">
        <RechargeForm />
        <AccountLookup onSearch={(id) => navigate(operatorAccountPath(id))} />
      </div>
    </div>
  )
}
