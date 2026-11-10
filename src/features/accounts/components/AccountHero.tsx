import { ArrowRightIcon, FileTextIcon, PlusIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { CopyButton } from '@/components/shared/CopyButton'
import { MoneyText } from '@/components/shared/MoneyText'
import { VirtualCard } from '@/components/shared/VirtualCard'
import { limits } from '@/config/limits'
import { formatAccountNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { availableBalance } from '../balance'
import { accountTypeLabels, type Account } from '../types'
import { CreateAccountDialog } from './CreateAccountDialog'

type AccountHeroProps = {
  accounts: Account[]
  selected: Account
  onSelect: (account: Account) => void
}

// Etiqueta corta para el selector: "Savings", "Savings 2"...
function pillLabel(account: Account, accounts: Account[]): string {
  const sameType = accounts.filter((a) => a.accountType === account.accountType)
  const position = sameType.findIndex((a) => a.id === account.id) + 1
  const base = accountTypeLabels[account.accountType]
  return sameType.length > 1 && position > 1 ? `${base} ${position}` : base
}

type HeroActionProps = {
  label: string
  icon: ReactNode
  primary?: boolean
  disabled?: boolean
  title?: string
  testId: string
  onClick?: () => void
}

// Acción circular del bloque principal (ícono + texto)
function HeroAction({ label, icon, primary, disabled, title, testId, ...props }: HeroActionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      data-testid={testId}
      className="hero-action group grid justify-items-center gap-2 text-[13px] font-semibold text-inverse-foreground disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      <span
        className={cn(
          'grid size-13 place-items-center rounded-full transition-colors [&_svg]:size-[22px]',
          primary
            ? 'bg-brand group-enabled:group-hover:bg-brand-strong'
            : 'bg-inverse-raised ring-1 ring-white/10 group-enabled:group-hover:bg-brand',
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      {label}
    </button>
  )
}

// Bloque principal: cuenta seleccionada, saldo, acciones y tarjeta virtual
export function AccountHero({ accounts, selected, onSelect }: AccountHeroProps) {
  const others = accounts.filter((a) => a.id !== selected.id)
  const overdraft = limits.overdraft[selected.accountType]

  return (
    <section
      aria-labelledby="selected-account-label"
      className="account-hero grid gap-8 overflow-hidden rounded-[32px] bg-inverse p-6 text-inverse-foreground sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]"
      data-testid="account-hero"
      data-account-id={selected.id}
    >
      <div className="min-w-0">
        {/* Selector de cuenta en píldoras */}
        <div
          role="group"
          aria-label="Select account"
          className="flex gap-1.5 overflow-x-auto pb-1"
          data-testid="account-switcher"
        >
          {accounts.map((account) => {
            const isSelected = account.id === selected.id
            return (
              <button
                key={account.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(account)}
                data-testid={`account-pill-${account.accountNumber}`}
                className={cn(
                  'account-pill shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors',
                  isSelected
                    ? 'bg-white text-inverse'
                    : 'bg-inverse-raised text-inverse-muted hover:text-inverse-foreground',
                )}
              >
                {pillLabel(account, accounts)}
              </button>
            )
          })}
        </div>

        <div className="mt-7 flex items-center gap-1.5 font-semibold text-inverse-muted">
          <span id="selected-account-label">
            {accountTypeLabels[selected.accountType]} balance ·{' '}
            <span className="tabular-nums" data-testid="selected-account-number">
              {formatAccountNumber(selected.accountNumber)}
            </span>
          </span>
          <CopyButton
            value={selected.accountNumber}
            label="Copy account number"
            testId="copy-account-number-button"
          />
        </div>

        <p
          className="mt-1 text-5xl leading-none font-extrabold tracking-[-0.045em] sm:text-7xl"
          aria-live="polite"
        >
          <MoneyText
            cents={selected.balance}
            split
            colorNegative={false}
            fractionClassName="text-inverse-muted"
            testId="selected-account-balance"
          />
        </p>

        <p
          className="mt-4 text-sm font-semibold text-inverse-muted"
          data-testid="selected-account-available"
        >
          {overdraft > 0 ? (
            <>
              Available incl. overdraft{' '}
              <MoneyText cents={availableBalance(selected)} colorNegative={false} />
            </>
          ) : (
            'No overdraft on this account'
          )}
        </p>

        <div className="mt-8 flex flex-wrap gap-6">
          <HeroAction
            label="Transfer"
            icon={<ArrowRightIcon />}
            primary
            disabled
            title="Transfers arrive in a next version"
            testId="hero-transfer-button"
          />
          <CreateAccountDialog
            onCreated={onSelect}
            trigger={
              <HeroAction
                label="Add account"
                icon={<PlusIcon />}
                testId="hero-add-account-button"
              />
            }
          />
          <HeroAction
            label="Details"
            icon={<FileTextIcon />}
            disabled
            title="Account details arrive in a next version"
            testId="hero-details-button"
          />
        </div>
      </div>

      {/* Tarjetas: la seleccionada al frente y la siguiente asomando detrás */}
      <div className="relative mx-auto hidden h-64 w-full max-w-sm sm:block" aria-hidden="true">
        {others.length > 0 && (
          <div className="absolute top-0 right-0 aspect-[1.586] w-[85%] rotate-[9deg] rounded-[22px] bg-[linear-gradient(135deg,#ff8a6b,#ff6b4a_60%,#e2553a)]" />
        )}
        <VirtualCard
          label={accountTypeLabels[selected.accountType]}
          accountNumber={selected.accountNumber}
          className="absolute top-8 left-0 w-[85%] -rotate-[7deg]"
        />
      </div>
    </section>
  )
}
