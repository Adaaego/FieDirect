import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Gallery({ photos = [], title = 'Property' }) {
  const [active, setActive] = useState(0)

  const validPhotos = (photos ?? []).filter((photo) => photo?.src)
  const activeIndex = active < validPhotos.length ? active : 0
  const current = validPhotos[activeIndex]

  // Empty state when no property photos are available
  if (!current) {
    return (
      <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-lg bg-muted text-muted-foreground md:aspect-[16/7]">
        <ImageOff className="size-10" aria-hidden="true" />

        <p className="text-sm font-medium">
          No photos available yet
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">

      {/* Main property photo */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted md:aspect-[16/7]">
        <img
          key={current.id}
          src={current.src}
          alt={current.alt || title}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />

        {/* Photo counter */}
        <span className="absolute bottom-3 right-3 rounded-md bg-ink/80 px-2 py-1 text-xs font-medium text-ink-foreground tabular">
          {activeIndex + 1} / {validPhotos.length}
        </span>
      </div>

      {/* Photo thumbnails */}
      {validPhotos.length > 1 && (
        <ul
          className="flex gap-2 overflow-x-auto"
          aria-label={`Photos of ${title}`}
        >
          {validPhotos.map((photo, index) => (
            <li key={photo.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}: ${photo.alt || title}`}
                aria-current={index === activeIndex}
                className={cn(
                  'relative block h-16 w-24 cursor-pointer overflow-hidden rounded-md border-2 border-transparent',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  index === activeIndex && 'border-primary',
                )}
              >
                <img
                  src={photo.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Photo verification statement */}
      <p className="text-xs text-muted-foreground">
        Photos taken by our team during the visit. Not edited, not staged.
      </p>
    </div>
  )
}