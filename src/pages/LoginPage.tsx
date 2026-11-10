import { Link, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AuthCard } from '@/components/shared/AuthCard'
import { routes } from '@/config/routes'
import { LoginForm } from '@/features/auth/components/LoginForm'
import type { LoginLocationState } from '@/features/auth/types'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // Email que llega desde el registro (si existe)
  const state = location.state as LoginLocationState | null

  // Iteración 1: el login funciona pero los tokens aún no se guardan (iteración 2)
  const handleSuccess = () => {
    toast.success('Signed in successfully')
    navigate(routes.home)
  }

  return (
    <AuthCard
      title="Sign in"
      description="Enter your email and password to access your accounts."
      testId="login-page"
      footer={
        <p>
          Don&apos;t have an account?{' '}
          <Link
            to={routes.register}
            className="font-medium underline underline-offset-4"
            data-testid="go-to-register-link"
          >
            Sign up
          </Link>
        </p>
      }
    >
      <LoginForm defaultEmail={state?.email} onSuccess={handleSuccess} />
    </AuthCard>
  )
}
