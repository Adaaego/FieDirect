import { Link } from 'react-router-dom'
import { House } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Logo({ className, inverted = false }) {
  const textColor = inverted
    ? 'text-ink-foreground'
    : 'text-primary'

  return (
    <Link
      to="/"
      className={cn('flex items-center gap-2', className)}
      aria-label="FieConnect home"
    >
      <House
        className={cn('size-6', textColor)}
        strokeWidth={2.25}
        aria-hidden="true"
      />

      <span
        className={cn(
          'font-display text-xl font-bold tracking-tight',
          textColor,
        )}
      >
        FieConnect<span className="text-signal">.</span>
      </span>
    </Link>
  )
}