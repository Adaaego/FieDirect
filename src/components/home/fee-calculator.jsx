import { useId, useState } from 'react'

import {
  durationLabel,
  ghs,
  moveInCost,
  VIEWING_FEE,
  TYPICAL_AGENT_FEE,
  FIEDIRECT_SHORT_TERM_FEE,
  FIEDIRECT_LONG_TERM_FEE,
} from '../../lib/format'

const advanceOptions = [1, 6, 12, 24]

const VIEWING_COUNT = 4
const TYPICAL_AGENT_VIEWING_FEE = 200

export function FeeCalculator() {
  const [rent, setRent] = useState(2500)
  const [advance, setAdvance] = useState(12)

  const rentId = useId()

  const {
    rent: rentTotal,
    fee,
    feeRate,
    agentFee,
    saving,
  } = moveInCost(rent, advance)

  const viewingFees = VIEWING_COUNT * VIEWING_FEE
  const typicalAgentViewingFees =
    VIEWING_COUNT * TYPICAL_AGENT_VIEWING_FEE

  const estimatedSaving =
    saving + typicalAgentViewingFees - viewingFees

  return (
    <section className="page-wrap pb-10 md:pb-14">
      <div className="grid gap-8 rounded-2xl bg-secondary p-6 md:grid-cols-2 md:p-10">

        {/* Calculator controls */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold text-balance sm:text-4xl">
              Do the maths before the agent does.
            </h2>

            <p className="leading-relaxed text-muted-foreground">
              For comparison, we estimate a traditional agent viewing
              at {ghs(TYPICAL_AGENT_VIEWING_FEE)}. FieDirect is{' '}
              {ghs(VIEWING_FEE)} per viewing, with service fees of{' '}
              {Math.round(FIEDIRECT_SHORT_TERM_FEE * 100)}% for
              agreements under six months and{' '}
              {Math.round(FIEDIRECT_LONG_TERM_FEE * 100)}% for
              six months or more.
            </p>
          </div>

          {/* Monthly rent slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor={rentId}
                className="text-sm font-semibold"
              >
                Monthly rent
              </label>

              <output
                htmlFor={rentId}
                className="font-display text-2xl font-bold tabular"
              >
                {ghs(rent)}
              </output>
            </div>

            <input
              id={rentId}
              type="range"
              min={500}
              max={12000}
              step={100}
              value={rent}
              aria-valuetext={ghs(rent)}
              onChange={(event) =>
                setRent(Number(event.target.value))
              }
              className="h-2 w-full cursor-pointer accent-primary"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{ghs(500)}</span>
              <span>{ghs(12000)}</span>
            </div>
          </div>

          {/* Rent advance selection */}
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-semibold">
              Advance the landlord wants
            </legend>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {advanceOptions.map((months) => (
                <label
                  key={months}
                  className="flex h-11 cursor-pointer items-center justify-center rounded-lg border bg-card text-sm font-semibold has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
                >
                  <input
                    type="radio"
                    name={`${rentId}-advance`}
                    value={months}
                    checked={advance === months}
                    onChange={() => setAdvance(months)}
                    className="sr-only"
                  />

                  {durationLabel(months)}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Cost comparison */}
        <div className="flex flex-col justify-between gap-6 rounded-xl bg-card p-6">
          <dl className="flex flex-col gap-3 text-sm">
            <Row
              label={`Advance rent (${durationLabel(advance)})`}
              value={ghs(rentTotal)}
            />

            <Row
              label={`Typical agent service fee (${Math.round(TYPICAL_AGENT_FEE * 100)}%)`}
              value={ghs(agentFee)}
              muted
            />

            <Row
              label={`Agent viewings · ${VIEWING_COUNT} × ${ghs(TYPICAL_AGENT_VIEWING_FEE)} est.`}
              value={ghs(typicalAgentViewingFees)}
              muted
            />

            <Row
              label={`FieDirect service fee (${Math.round(feeRate * 100)}%)`}
              value={ghs(fee)}
              strong
            />

            <Row
              label={`FieDirect viewings · ${VIEWING_COUNT} × ${ghs(VIEWING_FEE)}`}
              value={ghs(viewingFees)}
              strong
            />
          </dl>

          {/* Estimated savings */}
          <div
            className="rounded-lg bg-accent p-4 text-accent-foreground"
            aria-live="polite"
          >
            <p className="text-sm font-semibold">
              Estimated difference · {VIEWING_COUNT} viewings
            </p>

            <p className="font-display text-4xl font-bold tabular">
              {ghs(estimatedSaving)}
            </p>

            <p className="text-sm">
              compared with going through an agent.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value, muted = false, strong = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dashed pb-3 last:border-0">
      <dt
        className={
          muted ? 'text-muted-foreground' : 'font-medium'
        }
      >
        {label}
      </dt>

      <dd
        className={`shrink-0 tabular ${
          strong ? 'font-display text-lg font-bold text-primary' : ''
        } ${
          muted ? 'text-muted-foreground line-through' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  )
}