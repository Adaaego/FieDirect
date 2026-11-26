import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { ghs } from '../lib/format'

export default function AreasPage({
  areas = [],
  loading = false,
  error = null,
}) {
  return (
    <div className="page-wrap py-6 md:py-8">

      {/* Page heading */}
      <div className="flex max-w-2xl flex-col gap-3">
        <p className="eyebrow">Area guides</p>

        <h1 className="text-3xl font-bold text-balance sm:text-4xl">
          Know the area, not just the house.
        </h1>

        <p className="leading-relaxed text-muted-foreground">
          What rent really looks like, how long the commute takes
          when the traffic is bad, and the one thing locals would
          warn you about.
        </p>
      </div>

      {/* Area guides */}
      <div aria-busy={loading}>
        {loading ? (
          <div
            role="status"
            className="py-16 text-center text-sm text-muted-foreground"
          >
            Loading area guides...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-10 rounded-xl border bg-card p-8 text-center"
          >
            <h2 className="font-semibold">
              Unable to load area guides
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </div>
        ) : areas.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
            <MapPin
              className="mx-auto mb-3 size-9 text-muted-foreground"
              aria-hidden="true"
            />

            <h2 className="text-xl font-bold">
              Area guides coming soon
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              We're preparing neighbourhood guides to help you
              make more informed rental decisions.
            </p>

            <Link
              to="/listings"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Browse homes

              <ArrowRight
                className="size-4"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {areas.map((area) => (
              <li
                key={area.id}
                className="flex flex-col gap-4 rounded-xl border bg-card p-6"
              >

                {/* Area name and typical rent */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {area.name}
                    </h2>

                    {Number.isFinite(area.typicalRent?.min) &&
                    Number.isFinite(area.typicalRent?.max) ? (
                      <p className="mt-1 text-sm text-muted-foreground tabular">
                        {ghs(area.typicalRent.min)} –{' '}
                        {ghs(area.typicalRent.max)} / month
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Typical rent not yet confirmed
                      </p>
                    )}
                  </div>

                  {Number.isInteger(area.availableCount) &&
                    area.availableCount >= 0 && (
                      <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tabular">
                        {area.availableCount} available
                      </span>
                    )}
                </div>

                {/* Neighbourhood overview */}
                {area.summary && (
                  <p className="leading-relaxed">
                    {area.summary}
                  </p>
                )}

                {/* Neighbourhood highlights */}
                {area.goodFor?.length > 0 && (
                  <ul
                    className="flex flex-wrap gap-1.5"
                    aria-label="Good for"
                  >
                    {area.goodFor.map((item) => (
                      <li
                        key={item}
                        className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Practical neighbourhood information */}
                {(area.commute || area.watchOut) && (
                  <dl className="flex flex-col gap-3 border-t pt-4 text-sm">
                    {area.commute && (
                      <div>
                        <dt className="font-semibold">
                          Commute
                        </dt>

                        <dd className="text-muted-foreground">
                          {area.commute}
                        </dd>
                      </div>
                    )}

                    {area.watchOut && (
                      <div>
                        <dt className="font-semibold">
                          Watch out for
                        </dt>

                        <dd className="text-muted-foreground">
                          {area.watchOut}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                {/* Browse properties in this area */}
                {area.slug && (
                  <Link
                    to={`/listings?area=${encodeURIComponent(area.slug)}`}
                    className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Homes in {area.name}

                    <ArrowRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}