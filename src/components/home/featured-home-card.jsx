import { Link } from 'react-router-dom'
import {
  Bath,
  BedDouble,
  CalendarClock,
  Check,
  CookingPot,
  ImageOff,
  MapPin,
  ShieldCheck,
  Toilet,
  Wifi,
} from 'lucide-react'

import {
  durationOptionsLabel,
  ghs,
  kitchenLabel,
  listingTypeLabel,
} from '../../lib/format'

import { SaveButton } from '../listings/save-button'
import { StatusPill } from '../listings/status-pill'

const furnished = {
  unfurnished: 'Unfurnished',
  semi: 'Semi-furnished',
  fully: 'Furnished',
}

const roadConditions = {
  tarred: 'Tarred road',
  'untarred-good': 'Untarred, smooth',
  'untarred-rough': 'Rough road',
}

const internetConditions = {
  fibre: 'Fibre ready',
  '4g-strong': 'Strong 4G',
  '4g-patchy': 'Patchy 4G',
}

export function FeaturedHomeCard({ listing, priority = false }) {
  const attributes = listing.attributes ?? {}
  const cover = listing.photos?.find((photo) => photo?.src)

  const road = roadConditions[attributes.roadCondition]
  const internet = internetConditions[attributes.internet]
  const furnishing = furnished[listing.furnished]

  const durations = durationOptionsLabel(listing.paymentDurations ?? [])

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-shadow duration-300 hover:shadow-lg hover:shadow-foreground/5">

      {/* Property image */}
      <div className="relative aspect-[1.4] overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover.src}
            alt={cover.alt || listing.title}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-8" aria-hidden="true" />

            <span className="text-sm">
              No photo available
            </span>
          </div>
        )}

        {/* Property verification */}
        {listing.visitedAt && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-card/95 px-2.5 py-2 text-xs font-semibold text-primary shadow-sm backdrop-blur">
            <ShieldCheck className="size-4" aria-hidden="true" />
            FieDirect visited
          </span>
        )}

        {/* Save property */}
        <div className="absolute right-3 top-3">
          <SaveButton
            listingId={listing.id}
            title={listing.title}
          />
        </div>

        {/* Furnishing status */}
        {furnishing && (
          <span className="absolute bottom-3 left-3 rounded-md bg-card/95 px-2.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur">
            {furnishing}
          </span>
        )}
      </div>

      {/* Property information */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">

        {/* Rent and availability */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-xl font-bold tabular whitespace-nowrap">
            {Number.isFinite(listing.rentMonthly)
              ? ghs(listing.rentMonthly)
              : 'Not specified'}

            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
              / month
            </span>
          </p>

          <StatusPill status={listing.status} />
        </div>

        {/* Property title */}
        <h3 className="mt-3 text-base font-semibold leading-snug sm:text-lg">
          <Link
            to={`/listings/${listing.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring"
          >
            {listing.title}
          </Link>
        </h3>

        {/* Location */}
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin
            className="size-4 shrink-0"
            aria-hidden="true"
          />

          {listing.area?.name ?? 'Area not specified'}
        </p>

        {/* Property specifications */}
        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">

          <li className="inline-flex items-center gap-1.5">
            <BedDouble className="size-4" aria-hidden="true" />

            {listing.type === 'studio'
              ? 'Studio'
              : Number.isInteger(listing.bedrooms)
                ? `${listing.bedrooms} bed${listing.bedrooms === 1 ? '' : 's'}`
                : listingTypeLabel[listing.type] ?? 'Not specified'}
          </li>

          <li className="inline-flex items-center gap-1.5">
            <Bath className="size-4" aria-hidden="true" />

            {listing.bathroomAccess === 'shared'
              ? 'Shared bath'
              : Number.isInteger(listing.bathrooms)
                ? `${listing.bathrooms} bath${listing.bathrooms === 1 ? '' : 's'}`
                : 'Not specified'}
          </li>

          {durations && (
            <li className="inline-flex items-center gap-1.5">
              <CalendarClock
                className="size-4"
                aria-hidden="true"
              />

              {durations} advance
            </li>
          )}
        </ul>

        {/* Kitchen and bathroom access */}
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {['shared', 'private'].includes(listing.kitchenAccess) && (
            <span className="inline-flex items-center gap-1">
              <CookingPot
                className="size-3.5 text-primary"
                aria-hidden="true"
              />

              {kitchenLabel(listing)}
            </span>
          )}

          {['shared', 'private'].includes(listing.bathroomAccess) && (
            <span className="inline-flex items-center gap-1">
              <Toilet
                className="size-3.5 text-primary"
                aria-hidden="true"
              />

              {listing.bathroomAccess === 'shared'
                ? 'Shared toilet'
                : 'Private toilet'}
            </span>
          )}
        </p>

        {/* Additional rental costs */}
        <dl className="mt-3 grid grid-cols-2 gap-2 border-t pt-3 text-xs">
          <div>
            <dt className="text-muted-foreground">
              Security deposit
            </dt>

            <dd className="mt-0.5 font-semibold">
              {Number.isFinite(listing.securityDeposit)
                ? ghs(listing.securityDeposit)
                : 'Not specified'}
            </dd>
          </div>

          <div>
            <dt className="text-muted-foreground">
              Utilities / month
            </dt>

            <dd className="mt-0.5 font-semibold">
              {Number.isFinite(listing.utilityFeeMonthly)
                ? ghs(listing.utilityFeeMonthly)
                : 'Not specified'}
            </dd>
          </div>
        </dl>

        {/* Property conditions */}
        {(road || internet || attributes.foreignersAccepted === true) && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t pt-3 text-xs text-muted-foreground">

            {road && (
              <li className="inline-flex items-center gap-1.5">
                <Check
                  className="size-4 text-primary"
                  aria-hidden="true"
                />

                {road}
              </li>
            )}

            {internet && (
              <li className="inline-flex items-center gap-1.5">
                <Wifi
                  className="size-4 text-primary"
                  aria-hidden="true"
                />

                {internet}
              </li>
            )}

            {attributes.foreignersAccepted === true && (
              <li className="inline-flex items-center gap-1.5">
                <Check
                  className="size-4 text-primary"
                  aria-hidden="true"
                />

                Foreigners welcome
              </li>
            )}
          </ul>
        )}
      </div>
    </article>
  )
}