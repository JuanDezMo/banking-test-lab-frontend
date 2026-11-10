import { RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

type RadioCardProps = {
  id: string
  value: string
  label: string
  description: string
  checked: boolean
  testId?: string
}

// Opción de un RadioGroup con forma de tarjeta (título + descripción).
// Toda la tarjeta es el <label>, así que se puede pulsar en cualquier parte.
export function RadioCard({ id, value, label, description, checked, testId }: RadioCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'radio-card flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
        checked ? 'border-brand bg-accent' : 'border-border hover:bg-muted',
      )}
      data-testid={testId}
      data-state={checked ? 'checked' : 'unchecked'}
    >
      <RadioGroupItem id={id} value={value} className="mt-0.5" />
      <span>
        <span className="block font-bold">{label}</span>
        <span className="block text-sm text-muted-foreground">{description}</span>
      </span>
    </label>
  )
}
