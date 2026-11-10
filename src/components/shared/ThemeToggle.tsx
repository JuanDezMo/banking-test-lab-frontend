import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const options = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: MonitorIcon },
] as const

type ThemeToggleProps = {
  // inverse: sobre fondos oscuros (panel de marca del login)
  tone?: 'default' | 'inverse'
  className?: string
}

// Selector de tema: claro, oscuro o el del sistema operativo
export function ThemeToggle({ tone = 'default', className }: ThemeToggleProps) {
  const { theme = 'system', resolvedTheme, setTheme } = useTheme()
  const CurrentIcon = resolvedTheme === 'dark' ? MoonIcon : SunIcon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Change theme"
          title="Change theme"
          data-testid="theme-toggle"
          data-theme={resolvedTheme}
          className={cn(
            tone === 'inverse' && 'text-inverse-foreground hover:bg-white/10',
            className,
          )}
        >
          <CurrentIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44" data-testid="theme-menu">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            aria-checked={theme === value}
            role="menuitemradio"
            data-testid={`theme-option-${value}`}
          >
            <Icon aria-hidden="true" />
            {label}
            {theme === value && <CheckIcon className="ml-auto" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
