import { Link } from 'react-router-dom'
import {
  CookingPot,
  Globe2,
  Route,
  Signpost,
  Toilet,
  Wifi,
} from 'lucide-react'

import {
  daysAgo,
  distance,
  durationOptionsLabel,
  ghs,
  kitchenLabel,
  listingTypeLabel,
} from '../../lib/format'

import { cn } from '../../lib/utils'
import { StatusPill } from './status-pill'
import { SaveButton } from '../shared/save-button'
import { Signal } from '../shared/signal'

export function ListingCard({ listing, priority = false }) {
  const attributes = listing.attributes ?? {}
  const cover = listing.photos?.[0]
  const muted = listing.status === 'rented'

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card">

      {/* Property image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover?.src ? (
          <img
            src={cover.src}
            alt={cover.alt || listing.title}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]',
              muted && 'grayscale',
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No photo available
          </div>
        )}

        <div className="absolute left-3 top-3">
          <StatusPill status={listing.status} />
        </div>

        <div className="absolute right-3 top-3">
          <SaveButton
            listingId={listing.id}
            title={listing.title}
          />
        </div>
      </div>

      {/* Property information */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {listing.area?.name ?? 'Area not specified'}
            {' · '}
            {listingTypeLabel[listing.type] ?? listing.type ?? 'Property'}
          </p>

          <h3 className="text-lg font-bold leading-snug text-pretty">
            <Link
              to={`/listings/${listing.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring"
            >
              {listing.title}
            </Link>
          </h3>

          {/* Rental pricing */}
          <p className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold tabular">
              {listing.rentMonthly != null
                ? ghs(listing.rentMonthly)
                : 'Not specified'}
            </span>

            <span className="text-sm text-muted-foreground">
              / month
            </span>
          </p>

          <p className="text-xs text-muted-foreground">
            Advance options:{' '}
            {durationOptionsLabel(listing.paymentDurations ?? []) ||
              'Not specified'}
          </p>

          {/* Additional costs */}
          <dl className="mt-2 grid grid-cols-2 gap-2 border-t pt-2 text-xs">
            <div>
              <dt className="text-muted-foreground">
                Security deposit
              </dt>

              <dd className="mt-0.5 font-medium">
                {listing.securityDeposit != null
                  ? ghs(listing.securityDeposit)
                  : 'Not specified'}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground">
                Utilities / month
              </dt>

              <dd className="mt-0.5 font-medium">
                {listing.utilityFeeMonthly != null
                  ? ghs(listing.utilityFeeMonthly)
                  : 'Not specified'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Property conditions and amenities */}
        <ul
          className="flex flex-wrap gap-1.5"
          aria-label="Know before you go"
        >
          {attributes.roadCondition && (
            <Signal
              tone={
                attributes.roadCondition === 'tarred'
                  ? 'good'
                  : attributes.roadCondition === 'untarred-good'
                    ? 'neutral'
                    : attributes.roadCondition === 'untarred-rough'
                      ? 'bad'
                      : 'neutral'
              }
              icon={<Route className="size-3.5" aria-hidden="true" />}
            >
              {attributes.roadCondition === 'tarred'
                ? 'Tarred road'
                : attributes.roadCondition === 'untarred-good'
                  ? 'Untarred, smooth'
                  : attributes.roadCondition === 'untarred-rough'
                    ? 'Rough road'
                    : 'Road condition unknown'}
            </Signal>
          )}

          {Number.isFinite(attributes.distanceToMainRoadM) && (
            <Signal
              tone={
                attributes.distanceToMainRoadM <= 400
                  ? 'good'
                  : 'neutral'
              }
              icon={<Signpost className="size-3.5" aria-hidden="true" />}
            >
              {distance(attributes.distanceToMainRoadM)} to main road
            </Signal>
          )}

          {attributes.internet && (
            <Signal
              tone={
                attributes.internet === 'fibre'
                  ? 'good'
                  : attributes.internet === '4g-strong'
                    ? 'neutral'
                    : attributes.internet === '4g-patchy'
                      ? 'bad'
                      : 'neutral'
              }
              icon={<Wifi className="size-3.5" aria-hidden="true" />}
            >
              {attributes.internet === 'fibre'
                ? 'Fibre'
                : attributes.internet === '4g-strong'
                  ? 'Strong 4G'
                  : attributes.internet === '4g-patchy'
                    ? 'Patchy 4G'
                    : 'Internet availability unknown'}
            </Signal>
          )}

          {typeof attributes.foreignersAccepted === 'boolean' && (
            <Signal
              tone={attributes.foreignersAccepted ? 'good' : 'bad'}
              icon={<Globe2 className="size-3.5" aria-hidden="true" />}
            >
              {attributes.foreignersAccepted
                ? 'Foreigners welcome'
                : 'No foreigners'}
            </Signal>
          )}

          {['shared', 'private'].includes(listing.kitchenAccess) && (
            <Signal
              tone="neutral"
              icon={<CookingPot className="size-3.5" aria-hidden="true" />}
            >
              {kitchenLabel(listing)}
            </Signal>
          )}

          {['shared', 'private'].includes(listing.bathroomAccess) && (
            <Signal
              tone="neutral"
              icon={<Toilet className="size-3.5" aria-hidden="true" />}
            >
              {listing.bathroomAccess === 'shared'
                ? 'Shared toilet'
                : 'Private toilet'}
            </Signal>
          )}
        </ul>

        {/* Verification information */}
        <p className="mt-auto border-t pt-3 text-xs text-muted-foreground">
          {listing.visitedBy
            ? `Visited by ${listing.visitedBy}`
            : 'Visit not recorded'}

          {' · '}

          {listing.availabilityConfirmedAt
            ? `Availability checked ${daysAgo(
                listing.availabilityConfirmedAt,
              )}`
            : 'Availability not confirmed'}
        </p>
      </div>
    </article>
  )
}