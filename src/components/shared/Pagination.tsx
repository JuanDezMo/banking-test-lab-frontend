import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PaginationProps = {
  page: number
  hasNext: boolean
  onPageChange: (page: number) => void
  isFetching?: boolean
  label?: string
}

// Paginación simple anterior/siguiente (la API no devuelve el total de páginas)
export function Pagination({
  page,
  hasNext,
  onPageChange,
  isFetching = false,
  label = 'Pagination',
}: PaginationProps) {
  return (
    <nav
      aria-label={label}
      className="pagination flex items-center justify-between gap-3"
      data-testid="pagination"
    >
      <Button
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || isFetching}
        data-testid="pagination-previous"
      >
        <ChevronLeftIcon aria-hidden="true" />
        Previous
      </Button>
      <span
        className="text-sm font-semibold text-muted-foreground"
        aria-current="page"
        data-testid="pagination-current"
      >
        Page {page}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext || isFetching}
        data-testid="pagination-next"
      >
        Next
        <ChevronRightIcon aria-hidden="true" />
      </Button>
    </nav>
  )
}
