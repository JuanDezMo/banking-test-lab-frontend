import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AuthCard } from '@/components/shared/AuthCard'
import { routes } from '@/config/routes'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import type { LoginLocationState, User } from '@/features/auth/types'

export function RegisterPage() {
  const navigate = useNavigate()

  // Registro exitoso: aviso y redirección a login con el email precargado
  const handleSuccess = (user: User) => {
    toast.success('Account created. Please sign in.')
    navigate(routes.login, { state: { email: user.email } satisfies LoginLocationState })
  }

  return (
    <AuthCard
      title="Create your account"
      description="Sign up to open accounts and transfer money."
      testId="register-page"
      footer={
        <p>
          Already have an account?{' '}
          <Link
            to={routes.login}
            className="font-medium underline underline-offset-4"
            data-testid="go-to-login-link"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm onSuccess={handleSuccess} />
    </AuthCard>
  )
}
