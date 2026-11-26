import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  ImageOff,
  MapPin,
} from 'lucide-react'

import {
  ghs,
  listingTypeLabel,
  longDate,
} from '../../lib/format'

import { PaymentForm } from '../listings/payment-form'
import { StatusPill } from '../listings/status-pill'

export default function ListingPaymentPage({
  listing = null,
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
      <div role="alert" className="page-wrap py-20 text-center">
        <h1 className="text-2xl font-bold">
          Unable to load payment details
        </h1>

        <p className="mt-2 text-muted-foreground">
          Please try again later.
        </p>

        <BackLink />
      </div>
    )
  }

  // Property not found

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

  const cover = listing.photos?.find((photo) => photo?.src)

  return (
    <div className="page-wrap py-4 sm:py-6">

      {/* Back navigation */}

      <BackLink slug={listing.slug} />

      {/* Page heading */}

      <div className="mt-4 flex flex-col gap-2 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            Before you commit
          </p>

          <h1 className="mt-1 text-3xl font-bold text-balance sm:text-4xl">
            Review every cost.
          </h1>
        </div>

        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Choose an allowed rent advance and see the move-in
          total before continuing.
        </p>
      </div>

      {/* Property availability check */}

      {listing.status !== 'available' ? (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border bg-card p-5">
          <StatusPill status={listing.status} />

          <p className="leading-relaxed">
            This home cannot be secured right now.
            Please contact the FieDirect team for an update.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">

          {/* Payment form */}

          <PaymentForm
            key={listing.id}
            listing={listing}
          />

          {/* Property summary */}

          <aside
            aria-label="Property summary"
            className="overflow-hidden rounded-xl border bg-card"
          >
            {cover ? (
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={cover.src}
                  alt={cover.alt || listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                <ImageOff
                  className="size-8"
                  aria-hidden="true"
                />

                <p className="text-sm">
                  No photo available
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 p-5">
              <div>
                <h2 className="font-bold leading-snug">
                  {listing.title}
                </h2>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />

                  {listing.area?.name ?? 'Area not specified'}
                </p>
              </div>

              {/* Property specifications */}

              <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t pt-3 text-sm text-muted-foreground">
                <li className="inline-flex items-center gap-1.5">
                  <BadgeCheck
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />

                  {listingTypeLabel[listing.type] ?? 'Property'}
                </li>

                {listing.availableFrom && (
                  <li className="inline-flex items-center gap-1.5">
                    <CalendarDays
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />

                    Move in from {longDate(listing.availableFrom)}
                  </li>
                )}
              </ul>

              {/* Additional rental costs */}

              <dl className="flex flex-col gap-2 border-t pt-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">
                    Monthly utilities
                  </dt>

                  <dd className="font-medium tabular">
                    {Number.isFinite(listing.utilityFeeMonthly)
                      ? ghs(listing.utilityFeeMonthly)
                      : 'Not confirmed'}
                  </dd>
                </div>

                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">
                    Security deposit
                  </dt>

                  <dd className="font-medium tabular">
                    {Number.isFinite(listing.securityDeposit)
                      ? ghs(listing.securityDeposit)
                      : 'Not confirmed'}
                  </dd>
                </div>
              </dl>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Confirm all charges with FieDirect before signing
                your tenancy agreement.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function BackLink({ slug }) {
  return (
    <Link
      to={slug ? `/listings/${slug}` : '/listings'}
      className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft
        className="size-4"
        aria-hidden="true"
      />

      {slug ? 'Back to the home details' : 'All homes'}
    </Link>
  )
}