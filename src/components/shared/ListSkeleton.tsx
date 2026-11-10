import { Skeleton } from '@/components/ui/skeleton'

type ListSkeletonProps = {
  rows?: number
  label: string
  testId?: string
}

// Carga de una lista: filas con la forma de los elementos reales (ícono + dos líneas)
export function ListSkeleton({ rows = 4, label, testId }: ListSkeletonProps) {
  return (
    <div
      className="list-skeleton mt-4 grid gap-4"
      role="status"
      aria-label={label}
      data-testid={testId}
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3.5">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-3.5 w-2/5 rounded-full" />
            <Skeleton className="h-3 w-1/4 rounded-full" />
          </div>
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}
