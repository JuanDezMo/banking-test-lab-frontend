import { SearchIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type AccountLookupProps = {
  onSearch: (accountId: string) => void
}

// Búsqueda de una cuenta por su id (UUID). La API valida el formato (400) y la existencia (404).
export function AccountLookup({ onSearch }: AccountLookupProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const id = value.trim()
    if (!id) {
      setError('Enter an account id')
      return
    }
    setError(null)
    onSearch(id)
  }

  return (
    <form
      role="search"
      aria-label="Find account"
      className="account-lookup rounded-3xl bg-card p-5 sm:p-7"
      onSubmit={handleSubmit}
      noValidate
      data-testid="account-lookup-form"
    >
      <h2 className="mb-5 text-xl font-extrabold tracking-tight">Find an account</h2>
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="lookup-account-id">Account id</FieldLabel>
        <div className="flex gap-2">
          <Input
            id="lookup-account-id"
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="6f1c4e2a-8b1d-4c3e-9f7a-2d5b8c1e0a34"
            className="font-mono text-sm"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? 'lookup-account-id-error' : 'lookup-account-id-hint'}
            data-testid="lookup-account-id-input"
          />
          <Button type="submit" size="lg" className="h-11" data-testid="lookup-submit-button">
            <SearchIcon aria-hidden="true" />
            Search
          </Button>
        </div>
        {error ? (
          <FieldError id="lookup-account-id-error">{error}</FieldError>
        ) : (
          <FieldDescription id="lookup-account-id-hint">
            The account id is shown on each recharge receipt.
          </FieldDescription>
        )}
      </Field>
    </form>
  )
}
