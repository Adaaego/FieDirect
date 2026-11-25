import { useActionState, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { startPayment } from '../../lib/actions'
import {
  durationLabel,
  ghs,
  listingMoveInCost,
  VIEWING_FEE,
} from '../../lib/format'

const methods = [
  { value: 'momo-mtn', label: 'MTN MoMo' },
  { value: 'momo-telecel', label: 'Telecel Cash' },
  { value: 'momo-at', label: 'AT Money' },
  { value: 'card', label: 'Visa / Mastercard' },
  { value: 'bank', label: 'Bank transfer' },
]

const initialState = {
  ok: false,
  message: '',
}

export function PaymentForm({ listing }) {
  const [state, action, pending] = useActionState(
    startPayment,
    initialState,
  )

  const durations = (
    listing.paymentDurations?.length
      ? listing.paymentDurations
      : [listing.advanceMonths]
  ).filter((duration) => Number.isInteger(duration) && duration > 0)

  const [method, setMethod] = useState('momo-mtn')

  const [selectedMonths, setSelectedMonths] = useState(
    listing.advanceMonths,
  )

  const months = durations.includes(selectedMonths)
    ? selectedMonths
    : durations[0]

  // Prevent payment requests with incomplete rental information

  if (
    !months ||
    !Number.isFinite(listing.rentMonthly) ||
    listing.rentMonthly <= 0 ||
    !Number.isFinite(listing.securityDeposit) ||
    listing.securityDeposit < 0
  ) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-bold">
          Payment currently unavailable
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The rental charges or payment terms have not been confirmed.
          Please contact the FieDirect team.
        </p>
      </div>
    )
  }

  const costs = listingMoveInCost(listing, months)

  // Successful demo validation

  if (state.ok) {
    return (
      <div
        className="flex flex-col gap-3 rounded-xl border bg-card p-6"
        role="status"
      >
        <CheckCircle2
          className="size-8 text-primary"
          aria-hidden="true"
        />

        <h2 className="text-xl font-bold">
          Demo payment preview
        </h2>

        <p className="leading-relaxed text-muted-foreground">
          {state.message}
        </p>

        <p className="text-sm text-muted-foreground">
          Demo reference{' '}
          <span className="font-mono font-semibold text-foreground">
            {state.reference}
          </span>
        </p>
      </div>
    )
  }

  return (
    <form
      action={action}
      noValidate
      className="flex flex-col gap-5 rounded-xl border bg-card p-5 sm:p-6"
    >
      <input
        type="hidden"
        name="slug"
        value={listing.slug}
      />

      {/* Rent advance selection */}

      <fieldset
        disabled={pending}
        className="flex flex-col gap-2"
      >
        <legend className="mb-2 text-sm font-semibold">
          Choose your rent advance
        </legend>

        <div className="grid grid-cols-3 gap-2">
          {durations.map((duration) => (
            <label
              key={duration}
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            >
              <input
                type="radio"
                name="paymentMonths"
                value={duration}
                checked={months === duration}
                onChange={() => setSelectedMonths(duration)}
                className="sr-only"
              />

              {durationLabel(duration)}
            </label>
          ))}
        </div>
      </fieldset>

      {state.errors?.paymentMonths && (
        <p className="-mt-3 text-xs text-destructive">
          {state.errors.paymentMonths}
        </p>
      )}

      {/* Move-in cost breakdown */}

      <section
        aria-labelledby="move-in-breakdown"
        className="rounded-lg bg-secondary/60 p-4"
      >
        <h2 id="move-in-breakdown" className="font-bold">
          Move-in breakdown
        </h2>

        <dl className="mt-3 flex flex-col gap-2.5 text-sm">
          <CostRow
            label={`${durationLabel(months)} rent advance`}
            value={ghs(costs.rent)}
          />

          <CostRow
            label="Security deposit · one time"
            value={ghs(costs.securityDeposit)}
          />

          <div className="flex justify-between gap-4 border-t pt-2 font-semibold">
            <dt className="text-muted-foreground">
              Landlord total (rent + deposit)
            </dt>

            <dd className="shrink-0 tabular">
              {ghs(costs.landlordTotal)}
            </dd>
          </div>

          <CostRow
            label={`FieDirect service fee · ${Math.round(costs.feeRate * 100)}%`}
            value={ghs(costs.fee)}
          />

          <div className="flex justify-between gap-4 border-t pt-3 text-base font-bold">
            <dt>Total including FieDirect fee</dt>

            <dd className="shrink-0 font-display tabular">
              {ghs(costs.total)}
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Monthly utilities:{' '}

          <strong className="text-foreground">
            {listing.utilityFeeMonthly != null
              ? `${ghs(costs.utilityFeeMonthly)}/month`
              : 'Not confirmed'}
          </strong>
          , paid separately. The {ghs(VIEWING_FEE)} viewing fee
          is separate from rent and is not included above.
        </p>
      </section>

      {/* Payment method selection */}

      <fieldset
        disabled={pending}
        className="flex flex-col gap-2"
      >
        <legend className="mb-2 text-sm font-semibold">
          Payment method
        </legend>

        <div className="grid gap-2 sm:grid-cols-2">
          {methods.map((item) => (
            <label
              key={item.value}
              className="flex h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            >
              <input
                type="radio"
                name="method"
                value={item.value}
                checked={method === item.value}
                onChange={() => setMethod(item.value)}
                className="accent-primary"
              />

              {item.label}
            </label>
          ))}
        </div>

        {state.errors?.method && (
          <p className="text-xs text-destructive">
            {state.errors.method}
          </p>
        )}
      </fieldset>

      {/* Mobile money details */}

      {method.startsWith('momo') && (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">
            Mobile money number
          </span>

          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="024 123 4567"
            disabled={pending}
            aria-invalid={Boolean(state.errors?.phone)}
            className="h-11 rounded-lg border bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
          />

          {state.errors?.phone && (
            <span className="text-xs text-destructive">
              {state.errors.phone}
            </span>
          )}
        </label>
      )}

      {/* Payment terms confirmation */}

      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          name="agree"
          disabled={pending}
          className="mt-1 size-4 accent-primary"
        />

        <span>
          I have viewed this home and checked the costs and payment
          terms above. I understand this is a demo and no payment
          will be taken.
        </span>
      </label>

      {state.errors?.agree && (
        <p className="-mt-3 text-xs text-destructive">
          {state.errors.agree}
        </p>
      )}

      {/* Validation feedback */}

      {state.message && (
        <p
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {state.message}
        </p>
      )}

      {/* Submit payment preview */}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && (
          <Loader2
            className="size-4 animate-spin"
            aria-hidden="true"
          />
        )}

        {pending
          ? 'Processing...'
          : `Review ${ghs(costs.total)} move-in total`}
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Sample amounts only. No money is collected in this preview;
        confirm all charges in the signed tenancy agreement.
      </p>
    </form>
  )
}

// Reusable cost breakdown row

function CostRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">
        {label}
      </dt>

      <dd className="shrink-0 tabular">
        {value}
      </dd>
    </div>
  )
}