import { cn } from '../../lib/utils'

const styles = {
  available: {
    label: 'Available',
    className: 'bg-card text-foreground',
    dot: 'bg-primary',
  },
  inspecting: {
    label: 'Inspection in progress',
    className: 'bg-accent text-accent-foreground',
    dot: 'bg-signal',
  },
  reserved: {
    label: 'Reserved',
    className: 'bg-accent text-accent-foreground',
    dot: 'bg-foreground',
  },
  rented: {
    label: 'Rented',
    className: 'bg-ink text-ink-foreground',
    dot: 'bg-ink-foreground/60',
  },
  draft: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
}

export function StatusPill({ status, className }) {
  const style = styles[status] ?? styles.draft

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm',
        style.className,
        className,
      )}
    >
      <span
        className={cn('size-1.5 shrink-0 rounded-full', style.dot)}
        aria-hidden="true"
      />

      {style.label}
    </span>
  )
}