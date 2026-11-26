import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

import {
  ghs,
  VIEWING_FEE,
  FIEDIRECT_SHORT_TERM_FEE,
  FIEDIRECT_LONG_TERM_FEE,
} from '../../lib/format'

const budgets = [1000, 2500, 5000, 8000]

const delay = (ms) => ({
  '--delay': `${ms}ms`,
})

export function Hero({
  areas = [],
  backgroundImage,
  fieldNote,
}) {
  const navigate = useNavigate()

  const shortTermFee = Math.round(FIEDIRECT_SHORT_TERM_FEE * 100)
  const longTermFee = Math.round(FIEDIRECT_LONG_TERM_FEE * 100)

  // Navigate to listings with selected search filters

  function handleSearch(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams()

    for (const [key, value] of formData) {
      if (typeof value === 'string' && value.trim()) {
        params.set(key, value)
      }
    }

    const query = params.toString()

    navigate(query ? `/listings?${query}` : '/listings')
  }

  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-ink md:min-h-[640px] md:items-center lg:min-h-[calc(100svh-4rem)] lg:max-h-[860px]">

      {/* Optional hero background image */}

      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full scale-105 object-cover motion-safe:animate-[heroZoom_18s_ease-out_both]"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/70 to-ink/20 md:bg-linear-to-r md:from-ink/90 md:via-ink/60 md:to-ink/5"
          />
        </>
      )}

      <div className="page-wrap grid gap-8 py-10 md:py-16 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">

        {/* Hero content */}

        <div className="flex max-w-2xl flex-col gap-5 text-ink-foreground">
          <p
            className="eyebrow animate-rise text-signal"
            style={delay(0)}
          >
            Accra homes. No guesswork.
          </p>

          <h1
            className="animate-rise text-4xl font-bold leading-[1.04] text-balance sm:text-5xl lg:text-6xl"
            style={delay(80)}
          >
            Your next home.
            <br />
            Not your next headache.
          </h1>

          <p
            className="animate-rise max-w-xl text-base leading-relaxed text-ink-foreground/85 sm:text-lg"
            style={delay(160)}
          >
            Real homes. Real details. A team on your side.
            <br className="hidden sm:block" />
            {' '}Find a place in Accra without the runaround.
          </p>

          <p
            className="animate-rise text-sm font-semibold text-ink-foreground"
            style={delay(200)}
          >
            Personally visited. Honestly listed.
          </p>

          {/* Property search */}

          <form
            onSubmit={handleSearch}
            role="search"
            className="animate-rise mt-2 flex flex-col gap-2 rounded-xl bg-card p-2 text-foreground shadow-2xl sm:flex-row"
            style={delay(240)}
          >
            <label className="flex min-w-0 flex-1 flex-col px-3 py-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Area
              </span>

              <select
                name="area"
                defaultValue=""
                className="w-full cursor-pointer rounded-sm bg-transparent text-base font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">
                  All of Accra
                </option>

                {areas.map((area) => (
                  <option
                    key={area.id}
                    value={area.slug}
                  >
                    {area.name}
                  </option>
                ))}
              </select>
            </label>

            <span
              className="hidden w-px self-stretch bg-border sm:block"
              aria-hidden="true"
            />

            <label className="flex min-w-0 flex-1 flex-col px-3 py-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Monthly rent
              </span>

              <select
                name="maxRent"
                defaultValue=""
                className="w-full cursor-pointer rounded-sm bg-transparent text-base font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">
                  Any budget
                </option>

                {budgets.map((budget) => (
                  <option
                    key={budget}
                    value={budget}
                  >
                    Up to {ghs(budget)}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Search
                className="size-4"
                aria-hidden="true"
              />

              Show homes
            </button>
          </form>

          {/* Service highlights */}

          <ul
            className="animate-rise flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-foreground/75"
            style={delay(320)}
          >
            <li>
              <strong className="text-ink-foreground">
                {longTermFee}–{shortTermFee}%
              </strong>
              {' '}service fee by lease length
            </li>

            <li>
              <strong className="text-ink-foreground">
                {ghs(VIEWING_FEE)}
              </strong>
              {' '}per viewing
            </li>

            <li>
              Availability rechecked every{' '}
              <strong className="text-ink-foreground">
                72 hrs
              </strong>
            </li>
          </ul>
        </div>

        {/* Optional property inspection note */}

        {fieldNote && <FieldNote note={fieldNote} />}
      </div>
    </section>
  )
}

function FieldNote({ note }) {
  const rows = (note.rows ?? []).filter(
    (row) => row.label && row.value != null && row.value !== '',
  )

  if (!rows.length) return null

  return (
    <figure
      className="animate-rise hidden w-80 justify-self-end rounded-xl border border-ink-foreground/15 bg-card/95 p-5 shadow-2xl backdrop-blur lg:block"
      style={delay(480)}
    >
      <figcaption className="mb-3 flex items-center justify-between gap-2 border-b border-dashed pb-3">
        <span className="text-sm font-bold">
          Field note{note.area ? ` · ${note.area}` : ''}
        </span>

        {note.verified === true && (
          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Checked
          </span>
        )}
      </figcaption>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {rows.map(({ label, value }) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground">
              {label}
            </dt>

            <dd className="text-right font-medium">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {note.recordedBy && (
        <p className="mt-3 text-xs text-muted-foreground">
          Recorded on-site by {note.recordedBy}
          {note.recordedAt && ` · ${note.recordedAt}`}
        </p>
      )}
    </figure>
  )
}