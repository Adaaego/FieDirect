import { SavedList } from '../components/listings/saved-list'

export default function SavedPage({ listings = [] }) {
  return (
    <div className="page-wrap py-6 md:py-8">
      <h1 className="text-3xl font-bold sm:text-4xl">
        Saved homes
      </h1>

      <p className="mt-2 text-muted-foreground">
        Your shortlist. Book inspections back-to-back on the
        same day to save the trip.
      </p>

      <SavedList listings={listings} />
    </div>
  )
}