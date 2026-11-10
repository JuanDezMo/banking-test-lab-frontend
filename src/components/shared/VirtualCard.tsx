import { formatAccountNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { BrandLogo } from './BrandLogo'

type VirtualCardProps = {
  label: string
  accountNumber: string
  holder?: string
  className?: string
}

// Tarjeta virtual de una cuenta: el elemento distintivo de la marca
export function VirtualCard({ label, accountNumber, holder, className }: VirtualCardProps) {
  return (
    <div
      className={cn(
        'virtual-card relative flex aspect-[1.586] w-full flex-col justify-between overflow-hidden rounded-[22px] p-5 text-sm text-white sm:p-6 sm:text-base',
        'bg-[linear-gradient(150deg,#6b4dff_0%,#4a2fe0_45%,#2a1a9a_100%)]',
        'shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.18)]',
        // Brillo diagonal que da la sensación de tarjeta física
        'before:absolute before:inset-0 before:bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.14)_50%,transparent_65%)]',
        className,
      )}
      data-testid="virtual-card"
    >
      <div className="relative flex items-center justify-between font-bold">
        <span>{label}</span>
        <BrandLogo tone="inverse" showName={false} size={28} />
      </div>
      <span
        aria-hidden="true"
        className="relative h-7 w-10 rounded-md bg-[linear-gradient(135deg,#f6d7a7,#d7a95c)]"
      />
      <div className="relative flex items-center justify-between font-semibold">
        <span className="tracking-[0.12em] whitespace-nowrap sm:tracking-[0.16em]">
          {formatAccountNumber(accountNumber)}
        </span>
        {holder && <span className="hidden whitespace-nowrap sm:inline">{holder}</span>}
      </div>
    </div>
  )
}
