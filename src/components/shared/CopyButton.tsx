import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type CopyButtonProps = {
  value: string
  label: string
  className?: string
  testId?: string
}

// Botón de solo ícono que copia un texto al portapapeles
export function CopyButton({ value, label, className, testId }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy. Select the text and copy it manually.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={label}
      data-testid={testId}
      data-state={copied ? 'copied' : 'idle'}
      className={cn(
        'copy-button inline-grid size-8 place-items-center rounded-full transition-colors hover:bg-white/15',
        className,
      )}
    >
      {copied ? (
        <CheckIcon className="size-4" aria-hidden="true" />
      ) : (
        <CopyIcon className="size-4" aria-hidden="true" />
      )}
    </button>
  )
}
