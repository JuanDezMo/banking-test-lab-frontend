import type { ReactNode } from 'react'

type AuthCardProps = {
  title: string
  description: string
  footer?: ReactNode
  children: ReactNode
  testId?: string
}

// Bloque de las pantallas de autenticación: título, descripción, formulario y pie
export function AuthCard({ title, description, footer, children, testId }: AuthCardProps) {
  return (
    <section
      aria-labelledby={testId ? `${testId}-title` : undefined}
      className="auth-card w-full max-w-md rounded-[28px] bg-card p-6 shadow-[0_12px_40px_-24px_rgba(18,18,22,0.35)] sm:p-9"
      data-testid={testId}
    >
      <header className="mb-7">
        <h1
          id={testId ? `${testId}-title` : undefined}
          className="text-3xl font-extrabold tracking-tight"
        >
          {title}
        </h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </header>
      {children}
      {footer && (
        <footer className="mt-7 text-center text-sm text-muted-foreground">{footer}</footer>
      )}
    </section>
  )
}
