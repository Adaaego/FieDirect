import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  Sofa,
} from 'lucide-react'

import {
  durationOptionsLabel,
  listingTypeLabel,
  longDate,
} from '../../lib/format'

import { Gallery } from '../listings/gallery'
import { KnowBeforeYouGo } from '../listings/know-before-you-go'
import { BookingPanel } from '../listings/booking-panel'
import { ListingCard } from '../listings/listing-card'
import { StatusPill } from '../listings/status-pill'

const furnishedLabel = {
  unfurnished: 'Unfurnished',
  semi: 'Semi-furnished',
  fully: 'Fully furnished',
}

// Generate preferred inspection dates, excluding Sundays

function nextDays(count = 6) {
  const days = []
  const start = new Date()

  for (let i = 1; days.length < count; i++) {
    const date = new Date(start)

    date.setUTCDate(start.getUTCDate() + i)

    if (date.getUTCDay() === 0) continue

    days.push({
      value: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        timeZone: 'Africa/Accra',
      }),
    })
  }

  return days
}

export default function ListingDetailsPage({
  listing = null,
  listings = [],
  loading = false,
  error = null,
}) {
  const { slug } = useParams()

  // Loading state

  if (loading) {
    return (
      <div
        role="status"
        className="page-wrap py-20 text-center text-muted-foreground"
      >
        Loading property...
      </div>
    )
  }

  // Error state

  if (error) {
    return (
      <div className="page-wrap py-20 text-center">
        <h1 className="text-2xl font-bold">
          Unable to load property
        </h1>

        <p className="mt-2 text-muted-foreground">
          Please try again later.
        </p>

        <BackLink />
      </div>
    )
  }

  // Property unavailable

  if (!listing || listing.slug !== slug || listing.status === 'draft') {
    return (
      <div className="page-wrap py-20 text-center">
        <h1 className="text-2xl font-bold">
          Home not found
        </h1>

        <p className="mt-2 text-muted-foreground">
          This property may no longer be listed.
        </p>

        <BackLink />
      </div>
    )
  }

  const area = listing.area ?? {}

  const paymentOptions = durationOptionsLabel(
    listing.paymentDurations?.length
      ? listing.paymentDurations
      : listing.advanceMonths
        ? [listing.advanceMonths]
        : [],
  )

  // Retrieve similar available properties

  const similar = listings
    .filter(
      (home) =>
        home.id !== listing.id &&
        home.status === 'available' &&
        (
          (listing.areaId && home.areaId === listing.areaId) ||
          (
            Number.isFinite(home.rentMonthly) &&
            Number.isFinite(listing.rentMonthly) &&
            Math.abs(home.rentMonthly - listing.rentMonthly) < 2000
          )
        ),
    )
    .slice(0, 3)

  const specifications = [
    {
      icon: BedDouble,
      value: listingTypeLabel[listing.type],
    },
    {
      icon: Bath,
      value:
        listing.bathroomAccess === 'shared'
          ? 'Shared bathroom'
          : Number.isInteger(listing.bathrooms) && listing.bathrooms > 0
            ? `${listing.bathrooms} bathroom${listing.bathrooms > 1 ? 's' : ''}`
            : null,
    },
    {
      icon: Sofa,
      value: furnishedLabel[listing.furnished],
    },
    {
      icon: CalendarDays,
      value: listing.availableFrom
        ? `Move in from ${longDate(listing.availableFrom)}`
        : null,
    },
  ].filter((item) => item.value)

  return (
    <div className="page-wrap py-3 sm:py-4">

      {/* Back to property listings */}

      <BackLink />

      {/* Property photographs */}

      <div className="mt-3">
        <Gallery
          key={listing.id}
          photos={listing.photos}
          title={listing.title}
        />
      </div>

      {/* Property details and booking panel */}

      <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-10">

        {/* Booking and rental costs */}

        <aside
          className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-20 lg:self-start"
          aria-label="Move-in costs and inspection"
        >
          <BookingPanel
            key={listing.id}
            listing={listing}
            days={nextDays()}
          />
        </aside>

        {/* Property information */}

        <article className="order-2 min-w-0 lg:order-1">
          <header className="border-b pb-5">

            {/* Availability */}

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill
                status={listing.status}
                className="border shadow-none"
              />

              <span className="text-xs text-muted-foreground">
                {listing.availabilityConfirmedAt
                  ? `Availability checked ${longDate(listing.availabilityConfirmedAt)}`
                  : 'Availability not yet confirmed'}
              </span>
            </div>

            {/* Location */}

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {area.slug ? (
                <Link
                  to={`/listings?area=${encodeURIComponent(area.slug)}`}
                  className="hover:text-primary"
                >
                  {area.name}
                </Link>
              ) : (
                area.name ?? 'Area not specified'
              )}

              {listing.streetHint && ` · ${listing.streetHint}`}
            </p>

            {/* Property description */}

            <h1 className="mt-2 text-3xl font-bold leading-tight text-balance sm:text-4xl">
              {listing.title}
            </h1>

            {listing.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {listing.description}
              </p>
            )}

            {/* Property specifications */}

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              {specifications.map(({ icon: Icon, value }) => (
                <li
                  key={value}
                  className="inline-flex items-center gap-1.5"
                >
                  <Icon
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />

                  {value}
                </li>
              ))}
            </ul>

            {paymentOptions && (
              <p className="mt-3 text-xs text-muted-foreground">
                Payment options: {paymentOptions} rent advance.
              </p>
            )}
          </header>

          {/* Property inspection information */}

          <div className="mt-5">
            <KnowBeforeYouGo
              a={listing.attributes}
              visitedAt={listing.visitedAt}
              visitedBy={listing.visitedBy}
              listing={listing}
            />
          </div>

          {/* Neighbourhood information */}

          {(area.summary || area.commute || area.watchOut) && (
            <section className="mt-6 border-t pt-5">
              <h2 className="text-xl font-bold">
                Living in {area.name ?? 'this area'}
              </h2>

              {area.summary && (
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {area.summary}
                </p>
              )}

              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                {area.commute && (
                  <div>
                    <dt className="font-semibold">
                      Commute
                    </dt>

                    <dd className="mt-1 text-muted-foreground">
                      {area.commute}
                    </dd>
                  </div>
                )}

                {area.watchOut && (
                  <div>
                    <dt className="font-semibold">
                      Worth knowing
                    </dt>

                    <dd className="mt-1 text-muted-foreground">
                      {area.watchOut}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {/* FieDirect service information */}

          <section className="mt-6 border-t py-5">
            <h2 className="text-xl font-bold">
              A team on your side.
            </h2>

            <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
              We arrange the visit and handle the landlord
              conversation. Landlord contact details stay private,
              and every known charge is shown before you commit.
            </p>
          </section>
        </article>
      </div>

      {/* Similar properties */}

      {similar.length > 0 && (
        <section className="mt-8 border-t py-6 sm:py-8">
          <h2 className="text-2xl font-bold">
            Also worth a look
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((home) => (
              <ListingCard
                key={home.id}
                listing={home}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/listings"
      className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft
        className="size-4"
        aria-hidden="true"
      />

      All homes
    </Link>
  )
}