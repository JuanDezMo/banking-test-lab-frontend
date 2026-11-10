import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AuthCardProps = {
  title: string
  description: string
  footer?: ReactNode
  children: ReactNode
  testId?: string
}

// Tarjeta centrada para las pantallas de autenticación (login y registro)
export function AuthCard({ title, description, footer, children, testId }: AuthCardProps) {
  return (
    <section className="auth-card mx-auto w-full max-w-md" data-testid={testId}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-semibold">{title}</h1>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && <CardFooter className="justify-center text-sm">{footer}</CardFooter>}
      </Card>
    </section>
  )
}
