import { Heart } from 'lucide-react'
import { useSaved } from '../context/saved-provider'
import { cn } from '../../lib/utils'

export function SaveButton({ listingId, title, className }) {
  const { isSaved, toggle } = useSaved()
  const saved = isSaved(listingId)

  return (
    <button
      type="button"
      onClick={() => toggle(listingId)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      className={cn(
        'relative z-10 grid size-9 cursor-pointer place-items-center rounded-full bg-card/95 text-foreground shadow-sm transition-colors hover:bg-card',
        'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        className,
      )}
    >
      <Heart
        className={cn(
          'size-4',
          saved && 'fill-destructive text-destructive',
        )}
        aria-hidden="true"
      />
    </button>
  )
}