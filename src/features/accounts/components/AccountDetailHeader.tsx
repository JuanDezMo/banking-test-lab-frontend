import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router'
import { CopyButton } from '@/components/shared/CopyButton'
import { MoneyText } from '@/components/shared/MoneyText'
import { VirtualCard } from '@/components/shared/VirtualCard'
import { Button } from '@/components/ui/button'
import { transferPath } from '@/config/routes'
import { limits } from '@/config/limits'
import { formatDateTime } from '@/lib/date'
import { formatAccountNumber } from '@/lib/format'
import { availableBalance } from '../balance'
import { accountTypeLabels, type Account } from '../types'

type AccountDetailHeaderProps = {
  account: Account
  // false en la vista del operador: solo el cliente puede transferir (RN-23)
  showTransfer?: boolean
}

// Cabecera del detalle: tipo, número, saldo, disponible y fecha de apertura
export function AccountDetailHeader({ account, showTransfer = true }: AccountDetailHeaderProps) {
  const overdraft = limits.overdraft[account.accountType]

  return (
    <section
      aria-labelledby="account-detail-title"
      className="account-detail-header grid gap-8 overflow-hidden rounded-[32px] bg-inverse p-6 text-inverse-foreground sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-center"
      data-testid="account-detail-header"
      data-account-id={account.id}
    >
      <div className="min-w-0">
        <h1 id="account-detail-title" className="text-2xl font-extrabold tracking-tight">
          {accountTypeLabels[account.accountType]} account
        </h1>
        <div className="mt-1 flex items-center gap-1.5 font-semibold text-inverse-muted">
          <span className="tabular-nums" data-testid="account-detail-number">
            {formatAccountNumber(account.accountNumber)}
          </span>
          <CopyButton
            value={account.accountNumber}
            label="Copy account number"
            testId="detail-copy-account-number-button"
          />
        </div>

        <p className="mt-6 text-sm font-semibold text-inverse-muted">Balance</p>
        <p className="text-5xl leading-none font-extrabold tracking-[-0.045em] sm:text-6xl">
          <MoneyText
            cents={account.balance}
            split
            colorNegative={false}
            fractionClassName="text-inverse-muted"
            testId="account-detail-balance"
          />
        </p>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-inverse-muted">Available</dt>
            <dd className="font-bold">
              <MoneyText
                cents={availableBalance(account)}
                colorNegative={false}
                testId="account-detail-available"
              />
            </dd>
          </div>
          <div>
            <dt className="text-inverse-muted">Overdraft limit</dt>
            <dd className="font-bold">
              <MoneyText cents={overdraft} colorNegative={false} />
            </dd>
          </div>
          <div>
            <dt className="text-inverse-muted">Opened</dt>
            <dd className="font-bold">
              <time dateTime={account.createdAt}>{formatDateTime(account.createdAt)}</time>
            </dd>
          </div>
        </dl>

        {showTransfer && (
          <Button
            asChild
            variant="brand"
            size="lg"
            className="mt-7"
            data-testid="detail-transfer-link"
          >
            <Link to={transferPath(account.id)}>
              Transfer from this account
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>

      <div className="mx-auto hidden w-full max-w-xs sm:block" aria-hidden="true">
        <VirtualCard
          label={accountTypeLabels[account.accountType]}
          accountNumber={account.accountNumber}
          className="-rotate-[5deg]"
        />
      </div>
    </section>
  )
}
