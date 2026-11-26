import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  Globe2,
  ShieldCheck,
  SlidersHorizontal,
  WalletCards,
  Waves,
} from 'lucide-react'

import { FeaturedHomeCard } from './featured-home-card'
import { Reveal } from '../shared/reveal'
import { cn } from '../../lib/utils'

import {
  ghs,
  FIEDIRECT_SHORT_TERM_FEE,
  FIEDIRECT_LONG_TERM_FEE,
} from '../../lib/format'

const FEATURED_BUDGET = 1500
const FEATURED_LIMIT = 4

const filters = [
  { id: 'all', label: 'All homes' },
  { id: 'studio', label: 'Studios' },
  { id: 'furnished', label: 'Furnished' },
  { id: 'budget', label: `Under ${ghs(FEATURED_BUDGET)}` },
]

const promises = [
  {
    icon: Waves,
    title: 'The actual road',
    body: 'Tarred, gravel, or a muddy surprise?',
  },
  {
    icon: Eye,
    title: 'The real location',
    body: 'Main-road distance and nearby landmarks.',
  },
  {
    icon: Globe2,
    title: 'Your everyday essentials',
    body: 'Internet, water and who is welcome.',
  },
]

function filterListings(listings, filter) {
  switch (filter) {
    case 'studio':
      return listings.filter(
        (listing) => listing.type === 'studio',
      )

    case 'furnished':
      return listings.filter(
        (listing) => listing.furnished === 'fully',
      )

    case 'budget':
      return listings.filter(
        (listing) =>
          Number.isFinite(listing.rentMonthly) &&
          listing.rentMonthly < FEATURED_BUDGET,
      )

    default:
      return listings
  }
}

export function HomeShowcase({
  listings = [],
  loading = false,
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedFilter = searchParams.get('featured')

  const activeFilter = filters.some(
    (filter) => filter.id === requestedFilter,
  )
    ? requestedFilter
    : 'all'

  const filteredListings = filterListings(
    listings.filter((listing) =>
      ['available', 'inspecting'].includes(listing.status),
    ),
    activeFilter,
  ).slice(0, FEATURED_LIMIT)

  const shortTermFee = Math.round(FIEDIRECT_SHORT_TERM_FEE * 100)
  const longTermFee = Math.round(FIEDIRECT_LONG_TERM_FEE * 100)

  // Update the featured filter without leaving the homepage

  function updateFilter(id) {
    setSearchParams(
      (previous) => {
        const params = new URLSearchParams(previous)

        if (id === 'all') {
          params.delete('featured')
        } else {
          params.set('featured', id)
        }

        return params
      },
      { replace: true },
    )
  }

  return (
    <section
      aria-labelledby="homes-heading"
      className="page-wrap"
    >
      {/* FieDirect service highlights */}

      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 border-b py-4 text-xs font-medium sm:grid-cols-4 sm:gap-4 sm:py-5 sm:text-sm">
        <li className="inline-flex items-center gap-2">
          <ShieldCheck
            className="size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          Every home visited by us
        </li>

        <li className="inline-flex items-center gap-2">
          <Eye
            className="size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          No hidden details
        </li>

        <li className="inline-flex items-center gap-2">
          <WalletCards
            className="size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          {longTermFee}–{shortTermFee}% service fee, based on lease length.
        </li>

        <li className="inline-flex items-center gap-2">
          <Globe2
            className="size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          Locals &amp; newcomers welcome
        </li>
      </ul>

      {/* Featured properties */}

      <div className="py-8 sm:py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5">
            <p className="eyebrow">
              Less searching. More living.
            </p>

            <h2
              id="homes-heading"
              className="text-3xl font-bold text-balance sm:text-4xl"
            >
              Somewhere you'll want to stay.
            </h2>

            <p className="text-sm text-muted-foreground sm:text-base">
              Homes we've visited. Details you can trust.
            </p>
          </div>

          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Explore all homes

            <ArrowRight
              className="size-4"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Featured property filters */}

        <div
          role="group"
          aria-label="Filter featured homes"
          className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {filters.map((filter) => {
            const active = activeFilter === filter.id

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => updateFilter(filter.id)}
                aria-pressed={active}
                className={cn(
                  'inline-flex h-10 shrink-0 cursor-pointer items-center rounded-full border px-4 text-sm font-medium shadow-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-card hover:border-primary hover:text-primary',
                )}
              >
                {filter.label}
              </button>
            )
          })}

          <Link
            to="/listings#filters"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium shadow-sm transition-colors hover:border-primary hover:text-primary"
          >
            <SlidersHorizontal
              className="size-4"
              aria-hidden="true"
            />
            Filters
          </Link>
        </div>

        {/* Loading, empty and populated states */}

        <div aria-busy={loading}>
          {loading ? (
            <div
              className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              role="status"
              aria-label="Loading featured homes"
            >
              {Array.from({ length: FEATURED_LIMIT }, (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border bg-card"
                >
                  <div className="aspect-[1.4] animate-pulse bg-muted" />

                  <div className="flex flex-col gap-3 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="h-12 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredListings.map((listing, index) => (
                <Reveal
                  key={listing.id}
                  delay={index * 70}
                  className="h-full"
                >
                  <FeaturedHomeCard
                    listing={listing}
                    priority={index < 2}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed bg-card px-5 py-12 text-center">
              <p className="font-semibold">
                {activeFilter === 'all'
                  ? 'No featured homes available yet.'
                  : 'No homes in this group right now.'}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {activeFilter === 'all'
                  ? 'Check back for newly listed properties.'
                  : 'Try another filter or browse all properties.'}
              </p>

              {activeFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={() => updateFilter('all')}
                  className="mt-3 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  See all featured homes

                  <ArrowRight
                    className="size-4"
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <Link
                  to="/listings"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Browse homes

                  <ArrowRight
                    className="size-4"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Know before you go */}

      <div className="grid gap-5 border-y py-7 sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-8 sm:py-8">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">
            Know before you go
          </p>

          <h3 className="max-w-sm text-2xl font-bold leading-tight sm:text-3xl">
            The details other agents leave out.
          </h3>

          <Link
            to="/listings"
            className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            That's the FieDirect difference

            <ArrowRight
              className="size-4"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="grid gap-5 sm:grid-cols-3 sm:gap-4">
          {promises.map(({ icon: Icon, title, body }, index) => (
            <Reveal
              as="li"
              key={title}
              delay={index * 80}
              className="flex flex-col gap-2"
            >
              <Icon
                className="size-6 text-primary"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <h4 className="text-sm font-semibold">
                {title}
              </h4>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Roommate call to action */}

      <Link
        to="/roommates"
        className="group my-7 flex flex-col justify-between gap-4 rounded-xl bg-secondary p-5 transition-colors hover:bg-secondary/80 sm:my-8 sm:flex-row sm:items-center sm:px-7 sm:py-5"
      >
        <div>
          <p className="eyebrow">
            A new city feels better together
          </p>

          <h3 className="mt-1 text-xl font-bold sm:text-2xl">
            New to Accra? Find someone to share the rent.
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Meet people looking for the same kind of home.
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary">
          Find a roommate

          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </Link>
    </section>
  )
}