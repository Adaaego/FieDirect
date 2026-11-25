import { cn } from '../../lib/utils'

export const toneClass = {
  good: 'bg-primary/10 text-primary',
  neutral: 'bg-muted text-foreground',
  bad: 'bg-destructive/10 text-destructive',
}

export function Signal({ tone = 'neutral', icon, children, className }) {
  return (
    <li
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
        toneClass[tone] ?? toneClass.neutral,
        className,
      )}
    >
      {icon}
      {children}
    </li>
  )
}