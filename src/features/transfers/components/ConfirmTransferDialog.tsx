import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { SubmitButton } from '@/components/shared/SubmitButton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatAccountNumber } from '@/lib/format'
import { formatCents } from '@/lib/money'

export type TransferSummary = {
  originLabel: string
  originNumber: string
  destinationNumber: string
  amountCents: number
}

type ConfirmTransferDialogProps = {
  open: boolean
  summary: TransferSummary | null
  isPending: boolean
  errorMessage: string | null
  // Referencia visible de la operación (primeros 8 caracteres de la Idempotency-Key)
  reference: string | null
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

// Paso de revisión antes de mover el dinero (protege de envíos accidentales)
export function ConfirmTransferDialog({
  open,
  summary,
  isPending,
  errorMessage,
  reference,
  onConfirm,
  onOpenChange,
}: ConfirmTransferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent data-testid="confirm-transfer-dialog" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-tight">
            Review transfer
          </DialogTitle>
          <DialogDescription>Check the details before sending the money.</DialogDescription>
        </DialogHeader>

        {summary && (
          <dl className="grid gap-3 rounded-2xl bg-muted p-4" data-testid="transfer-summary">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">From</dt>
              <dd className="text-right font-bold tabular-nums" data-testid="summary-origin">
                {summary.originLabel} · {formatAccountNumber(summary.originNumber)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">To</dt>
              <dd className="font-bold tabular-nums" data-testid="summary-destination">
                {formatAccountNumber(summary.destinationNumber)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t pt-3">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="text-2xl font-extrabold tabular-nums" data-testid="summary-amount">
                {formatCents(summary.amountCents)}
              </dd>
            </div>
            {reference && (
              <div className="flex justify-between gap-4 text-xs text-muted-foreground">
                <dt>Reference</dt>
                <dd className="font-mono" data-testid="summary-reference">
                  {reference}
                </dd>
              </div>
            )}
          </dl>
        )}

        {errorMessage && (
          <ErrorAlert
            title="The transfer was not completed"
            align="center"
            testId="transfer-error-alert"
          >
            {errorMessage}
          </ErrorAlert>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            data-testid="cancel-transfer-button"
          >
            Edit details
          </Button>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              onConfirm()
            }}
          >
            <SubmitButton
              variant="brand"
              className="w-full sm:w-auto"
              isPending={isPending}
              pendingText="Sending..."
              data-testid="confirm-transfer-button"
            >
              {errorMessage ? 'Try again' : 'Confirm transfer'}
            </SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
