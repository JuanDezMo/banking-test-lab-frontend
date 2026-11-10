import { PlusIcon } from 'lucide-react'
import { MoneyText } from '@/components/shared/MoneyText'
import { Button } from '@/components/ui/button'
import { limits } from '@/config/limits'
import { formatAccountNumber } from '@/lib/format'
import { formatCents } from '@/lib/money'
import { cn } from '@/lib/utils'
import { totalBalance } from '../balance'
import { accountTypeLabels, type Account } from '../types'
import { CreateAccountDialog } from './CreateAccountDialog'

type AccountListProps = {
  accounts: Account[]
  selectedId: string
  onSelect: (account: Account) => void
}

// Lista de todas las cuentas con el saldo total
export function AccountList({ accounts, selectedId, onSelect }: AccountListProps) {
  return (
    <section
      aria-labelledby="account-list-title"
      className="account-list rounded-3xl bg-card p-5 sm:p-6"
      data-testid="account-list"
    >
      <div className="flex items-center justify-between">
        <h2 id="account-list-title" className="text-lg font-extrabold tracking-tight">
          Accounts
        </h2>
        <span className="text-sm text-muted-foreground">
          Total{' '}
          <MoneyText
            cents={totalBalance(accounts)}
            className="font-bold text-foreground"
            testId="accounts-total-balance"
          />
        </span>
      </div>

      <ul className="mt-3 grid gap-1">
        {accounts.map((account) => {
          const isSelected = account.id === selectedId
          const overdraft = limits.overdraft[account.accountType]
          return (
            <li key={account.id}>
              <button
                type="button"
                onClick={() => onSelect(account)}
                aria-current={isSelected ? 'true' : undefined}
                data-testid={`account-row-${account.accountNumber}`}
                className={cn(
                  'account-row grid w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-2xl p-2.5 text-left transition-colors',
                  isSelected ? 'bg-accent' : 'hover:bg-muted',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-11 place-items-center rounded-[14px] font-extrabold',
                    account.accountType === 'savings'
                      ? 'bg-brand text-brand-foreground'
                      : 'bg-coral text-inverse',
                  )}
                >
                  {account.accountType === 'savings' ? 'S' : 'C'}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{accountTypeLabels[account.accountType]}</span>
                  <span className="block truncate text-sm text-muted-foreground tabular-nums">
                    {formatAccountNumber(account.accountNumber)}
                    {overdraft > 0 && ` · overdraft ${formatCents(overdraft)}`}
                  </span>
                </span>
                <MoneyText cents={account.balance} className="font-extrabold" />
              </button>
            </li>
          )
        })}
      </ul>

      <CreateAccountDialog
        onCreated={onSelect}
        trigger={
          <Button className="mt-4 w-full" size="lg" data-testid="open-account-button">
            <PlusIcon aria-hidden="true" />
            Open new account
          </Button>
        }
      />
    </section>
  )
}
