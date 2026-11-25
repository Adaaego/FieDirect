import { Link } from 'react-router-dom'
import { useSaved } from '../../context/saved-provider'
import { ListingCard } from './listing-card'

export function SavedList({ listings = [] }) {
  const { savedIds } = useSaved()

  const saved = listings.filter((listing) =>
    savedIds.includes(listing.id),
  )

  // Empty state
  if (saved.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-16 text-center">
        <h2 className="text-xl font-bold">
          Nothing saved yet
        </h2>

        <p className="max-w-sm text-sm text-muted-foreground">
          Tap the heart on any home to keep it here while you compare.
        </p>

        <Link
          to="/listings"
          className="mt-2 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Browse homes
        </Link>
      </div>
    )
  }

  // Saved property listings
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
        />
      ))}
    </div>
  )
}