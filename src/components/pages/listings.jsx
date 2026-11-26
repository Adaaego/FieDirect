import { Link, useSearchParams } from 'react-router-dom'
import { ListingFilters } from '../listings/filters'
import { ListingCard } from '../listings/listing-card'

const whatsapp =
  'https://wa.me/233535702336?text=Hi%20FieDirect%2C%20I%27m%20looking%20for%20a%20place'

export default function ListingsPage({
  areas = [],
  listings = [],
  loading = false,
  error = null,
}) {
  const [searchParams] = useSearchParams()

  const selectedArea = searchParams.get('area')
  const areaName = areas.find(
    (area) => area.slug === selectedArea,
  )?.name

  const available = listings.filter(
    (listing) => listing.status === 'available',
  ).length

  const inspecting = listings.filter(
    (listing) => listing.status === 'inspecting',
  ).length

  const reservedOrRented = listings.filter(
    (listing) => ['reserved', 'rented'].includes(listing.status),
  ).length

  const hasFilters = searchParams.size > 0

  return (
    <div className="page-wrap py-6 md:py-8">

      {/* Page heading */}
      <div className="flex flex-col gap-2">
        <p className="eyebrow">
          Every home visited in person
        </p>

        <h1 className="text-3xl font-bold text-balance sm:text-4xl">
          Homes in {areaName ?? 'Accra'}
        </h1>

        {!loading && !error && (
          <p
            className="text-muted-foreground"
            aria-live="polite"
          >
            <span className="font-semibold text-foreground tabular">
              {available}
            </span>
            {' '}available

            {inspecting > 0 && (
              <>
                {' · '}
                <span className="font-semibold text-foreground tabular">
                  {inspecting}
                </span>
                {' '}being inspected now
              </>
            )}

            {reservedOrRented > 0 && (
              <>
                {' · '}
                {reservedOrRented} reserved or recently rented
              </>
            )}

            {' · '}all visited by our team
          </p>
        )}
      </div>

      {/* Property filters */}
      <div
        id="filters"
        className="z-30 -mx-4 mt-5 scroll-mt-16 border-b bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 md:sticky md:top-16 lg:-mx-10 lg:px-10"
      >
        <ListingFilters areas={areas} />
      </div>

      {/* Property results */}
      <div aria-busy={loading}>
        {loading ? (
          <div
            role="status"
            className="py-16 text-center text-sm text-muted-foreground"
          >
            Loading homes...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center"
          >
            <h2 className="font-semibold">
              Unable to load homes
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </div>
        ) : listings.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing, index) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                priority={index < 2}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-16 text-center">
            <h2 className="text-xl font-bold">
              {hasFilters
                ? 'Nothing matches yet'
                : 'No homes listed yet'}
            </h2>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {hasFilters
                ? 'Try adjusting your filters, or tell us what you need and we’ll go looking.'
                : 'We only list homes we have personally visited. Check back for new properties, or contact our team.'}
            </p>

            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {hasFilters && (
                <Link
                  to="/listings"
                  className="inline-flex h-10 items-center rounded-lg border px-4 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  Clear filters
                </Link>
              )}

              <a
                href={whatsapp}
                className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                WhatsApp the team
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}