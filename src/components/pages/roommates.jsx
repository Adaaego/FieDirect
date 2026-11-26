import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, MapPin, UsersRound } from 'lucide-react'

import { Reveal } from '../shared/reveal'
import { cn } from '../../lib/utils'
import { RoommateCard } from './roommate-card'

export default function RoommatesPage({
  areas = [],
  profiles = [],
  loading = false,
  error = null,
  whatsappNumber = '',
}) {
  const [searchParams] = useSearchParams()
  const selectedSlug = searchParams.get('area')

  const selectedArea = areas.find(
    (area) => area.slug === selectedSlug,
  )

  const people = profiles
    .filter(
      (person) =>
        !selectedSlug ||
        person.areas?.some(
          (area) => area.slug === selectedSlug,
        ),
    )
    .sort((a, b) =>
      (b.createdAt ?? '').localeCompare(a.createdAt ?? ''),
    )

  return (
    <div className="page-wrap py-5 sm:py-8">

      {/* Page hero */}
      <section className="grid overflow-hidden rounded-2xl bg-ink text-ink-foreground md:grid-cols-[1.3fr_0.7fr]">
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
          <p className="eyebrow text-signal">
            Good homes. Good company.
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
            Find your people.
            <br className="hidden sm:block" />
            {' '}Share the rent, not the stress.
          </h1>

          <p className="max-w-2xl leading-relaxed text-ink-foreground/75 sm:text-lg">
            A year upfront is a lot on one salary. Meet people
            looking for the same kind of home, then let our
            team make a thoughtful introduction.
          </p>

          <div className="mt-1 flex flex-wrap gap-2 text-sm">
            {!loading && !error && (
              <span className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 px-3 py-1.5">
                <UsersRound
                  className="size-4 text-signal"
                  aria-hidden="true"
                />

                {profiles.length}{' '}
                {profiles.length === 1 ? 'profile' : 'profiles'}
              </span>
            )}

            <span className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 px-3 py-1.5">
              <MapPin
                className="size-4 text-signal"
                aria-hidden="true"
              />
              Across Accra
            </span>
          </div>
        </div>

        <div className="relative hidden min-h-56 flex-col justify-between overflow-hidden bg-primary p-7 text-primary-foreground md:flex lg:p-9">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-14 size-64 rounded-full border border-primary-foreground/20"
          />

          <div
            aria-hidden="true"
            className="absolute -right-1 top-0 size-44 rounded-full border border-primary-foreground/20"
          />

          <p className="relative text-sm font-medium text-primary-foreground/75">
            A good match starts with a conversation.
          </p>

          <UsersRound
            className="relative size-16"
            strokeWidth={1.4}
            aria-hidden="true"
          />

          <p className="relative max-w-xs text-2xl font-bold leading-tight">
            Different stories. One place to call home.
          </p>
        </div>
      </section>

      {/* Roommate profiles */}
      <section className="py-6 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">
              Meet the community
            </p>

            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              People looking to share a home
              {selectedArea
                ? ` in ${selectedArea.name}`
                : ' in Accra'}.
            </h2>
          </div>

          {!loading && !error && (
            <p
              className="text-sm text-muted-foreground"
              aria-live="polite"
            >
              {people.length}{' '}
              {people.length === 1 ? 'profile' : 'profiles'}
            </p>
          )}
        </div>

        {/* Area filters */}
        <nav
          aria-label="Filter by area"
          className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          <AreaLink to="/roommates" active={!selectedSlug}>
            All areas
          </AreaLink>

          {areas.map((area) => (
            <AreaLink
              key={area.id}
              to={`/roommates?area=${encodeURIComponent(area.slug)}`}
              active={selectedSlug === area.slug}
            >
              {area.name}
            </AreaLink>
          ))}
        </nav>

        {/* Profile results */}
        <div aria-busy={loading}>
          {loading ? (
            <p
              role="status"
              className="py-16 text-center text-sm text-muted-foreground"
            >
              Loading roommate profiles...
            </p>
          ) : error ? (
            <div
              role="alert"
              className="mt-5 rounded-xl border p-8 text-center"
            >
              <p className="font-semibold">
                Unable to load roommate profiles
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please try again later.
              </p>
            </div>
          ) : people.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed bg-card px-5 py-12 text-center">
              <UsersRound
                className="mx-auto mb-3 size-9 text-muted-foreground"
                aria-hidden="true"
              />

              <p className="font-semibold">
                {selectedSlug
                  ? `No profiles in ${selectedArea?.name ?? 'this area'} yet.`
                  : 'No roommate profiles yet.'}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Check back as our roommate community grows.
              </p>

              {selectedSlug && (
                <Link
                  to="/roommates"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  See all areas
                  <ArrowRight
                    className="size-4"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </div>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {people.map((person, index) => (
                <Reveal
                  as="li"
                  key={person.id}
                  delay={index * 60}
                >
                  <RoommateCard
                    person={person}
                    index={index}
                    whatsappNumber={whatsappNumber}
                  />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function AreaLink({ to, active, children }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'bg-card hover:border-primary hover:text-primary',
      )}
    >
      {children}
    </Link>
  )
}