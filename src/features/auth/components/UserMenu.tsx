import { LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { routes } from '@/config/routes'
import { useLogout } from '../hooks/useAuthMutations'
import type { SessionUser } from '@/store/authStore'
import { cn } from '@/lib/utils'

type UserMenuProps = {
  user: SessionUser
  // compact: solo el avatar (barra móvil)
  compact?: boolean
}

const roleLabel = { customer: 'Customer', operator: 'Operator' } as const

// Iniciales a partir del email: ana.perez@mail.com → AP
function initialsFromEmail(email: string): string {
  const name = email.split('@')[0] ?? ''
  const parts = name.split(/[._-]+/).filter(Boolean)
  const letters = parts.length > 1 ? `${parts[0]![0]}${parts[1]![0]}` : name.slice(0, 2)
  return letters.toUpperCase()
}

// Menú de usuario: muestra email y rol, y permite cerrar sesión
export function UserMenu({ user, compact = false }: UserMenuProps) {
  const navigate = useNavigate()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        toast.success('You have signed out')
        navigate(routes.login, { replace: true })
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'user-menu-trigger flex items-center gap-3 rounded-2xl text-left transition-colors hover:bg-secondary',
          compact ? 'p-0.5' : 'w-full p-2',
        )}
        aria-label="Open user menu"
        data-testid="user-menu-trigger"
      >
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#4a2fe0,#a3304f)] text-sm font-extrabold text-white"
        >
          {initialsFromEmail(user.email)}
        </span>
        {!compact && (
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold" data-testid="user-menu-email">
              {user.email}
            </span>
            <span className="block text-xs text-muted-foreground" data-testid="user-menu-role">
              {roleLabel[user.role]}
            </span>
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60" data-testid="user-menu">
        <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleLogout}
          disabled={logout.isPending}
          data-testid="logout-button"
        >
          <LogOutIcon aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
