import { useActionState, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, CheckCircle2, Loader2, MapPin, X } from 'lucide-react'
import { bookInspection } from '../../lib/action'
import { durationLabel, ghs, listingMoveInCost, VIEWING_FEE } from '../../lib/format'
import { cn } from '../../lib/utils'
const slots = [
  { value: '09:00', label: '9am' },
  { value: '11:00', label: '11am' },
  { value: '14:00', label: '2pm' },
  { value: '16:00', label: '4pm' },
]
const initial = { ok: false, message: '' }
const whatsapp =
  'https://wa.me/233535702336?text=Hi%20FieDirect%2C%20please%20update%20me%20about%20this%20home%20under%20inspection.'
export function BookingPanel({ listing, days = [] }) {
  const [state, action, pending] = useActionState(bookInspection, initial)
  const [months, setMonths] = useState(listing.advanceMonths)
  const [visitType, setVisitType] = useState('in-person')
  const dialogRef = useRef(null)
  const durations = listing.paymentDurations?.length ? listing.paymentDurations : [listing.advanceMonths]
  const costs = listingMoveInCost(listing, months)
  const available = listing.status === 'available'
  const reserved = listing.status === 'reserved'
  const inspecting = listing.status === 'inspecting'
  function openBooking(type) {
    setVisitType(type)
    dialogRef.current?.showModal()
  }
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <section aria-labelledby="cost" className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="font-display text-3xl font-bold tabular">
            {ghs(listing.rentMonthly)} <span className="text-base font-normal text-muted-foreground">/ month</span>
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
            <span
              className={cn(
                'size-2 rounded-full',
                available ? 'bg-primary' : inspecting || reserved ? 'bg-signal' : 'bg-muted-foreground',
              )}
              aria-hidden="true"
            />
            {available
              ? 'Available in demo'
              : inspecting
                ? 'Inspection in progress'
                : reserved
                  ? 'Reserved'
                  : 'Recently rented'}
          </span>
        </div>
        <h2 id="cost" className="mt-5 text-base font-bold">
          No surprises in the numbers.
        </h2>
        <fieldset className="mt-3">
          <legend className="mb-2 text-sm text-muted-foreground">Choose your rent advance</legend>
          <div className="grid grid-cols-3 gap-2">
            {durations.map((duration) => (
              <label
                key={duration}
                className="flex min-h-10 cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
              >
                <input
                  type="radio"
                  name={`duration-${listing.id}`}
                  value={duration}
                  checked={months === duration}
                  onChange={() => setMonths(duration)}
                  className="sr-only"
                />
                {durationLabel(duration)}
              </label>
            ))}
          </div>
        </fieldset>
        <dl className="mt-4 flex flex-col gap-2.5 text-sm">
          <CostRow label={`${durationLabel(months)} rent advance`} value={ghs(costs.rent)} />
          <CostRow label="Security deposit · one time" value={ghs(costs.securityDeposit)} />
          <div className="flex justify-between gap-4 border-t pt-2.5 font-semibold">
            <dt className="text-muted-foreground">Landlord total (rent + deposit)</dt>
            <dd className="shrink-0 tabular">{ghs(costs.landlordTotal)}</dd>
          </div>
          <CostRow label={`FieDirect service fee · ${Math.round(costs.feeRate * 100)}%`} value={ghs(costs.fee)} />
          <div className="flex justify-between gap-4 border-t pt-3 text-base font-bold">
            <dt>Total including FieDirect fee</dt>
            <dd className="shrink-0 font-display tabular">{ghs(costs.total)}</dd>
          </div>
        </dl>
        <div className="mt-3 flex flex-col gap-1.5 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
          <p className="flex justify-between gap-3">
            <span>Monthly utilities / service fee</span>
            <strong className="shrink-0 text-foreground">{ghs(costs.utilityFeeMonthly)} / month</strong>
          </p>
          <p>Utilities are separate and not included in the move-in total.</p>
        </div>
        <div className="mt-4 rounded-lg bg-secondary/70 p-3 text-xs leading-relaxed">
          <p className="font-semibold">FieDirect viewing fee: {ghs(VIEWING_FEE)} per person</p>
          <p className="mt-0.5 text-muted-foreground">
            Agent viewing fees are often around GH₵200 (estimate). We'll confirm payment instructions before your
            visit.
          </p>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Sample rent, utility and deposit figures. Confirm every amount and term in the signed tenancy agreement.
        </p>
        {available && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => openBooking('in-person')}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <CalendarDays className="size-4" aria-hidden="true" /> Book an inspection
            </button>
          </div>
        )}
        {reserved && (
          <>
            <p className="mt-4 rounded-lg bg-secondary px-3 py-2 text-sm">
              This home is reserved. Preview the waitlist form; no request is recorded.
            </p>
            <button
              type="button"
              onClick={() => openBooking('waitlist')}
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg border bg-card px-4 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              Join the waitlist
            </button>
          </>
        )}
        {inspecting && (
          <div className="mt-4 rounded-lg bg-accent/50 p-3 text-sm leading-relaxed">
            <p className="font-semibold">A viewing is underway right now.</p>
            <p className="mt-1 text-muted-foreground">We'll confirm the outcome before you make the trip.</p>
            <a
              href={whatsapp}
              className="mt-2 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              Ask for an update <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        )}
        {listing.status === 'rented' && (
          <Link
            to="/listings?available=1"
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
          >
            See available homes <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
        {available && (
          <Link
            to={`/listings/${listing.slug}/pay`}
            className="mt-3 flex items-center justify-center gap-1 text-center text-xs font-semibold text-primary hover:underline"
          >
            Already viewed? Reserve now <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </section>
      <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-muted-foreground">
        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> The person who visited meets you
        at the gate and confirms the exact meeting point on WhatsApp.
      </p>
      <dialog
        ref={dialogRef}
        aria-labelledby="booking-title"
        className="booking-dialog m-auto max-h-[min(90dvh,46rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border bg-background p-0 text-foreground shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b p-5 sm:p-6">
          <div>
            <p className="eyebrow">One quick step</p>
            <h2 id="booking-title" className="mt-1 text-2xl font-bold">
              {visitType === 'video-call'
                ? 'Request a live video call'
                : visitType === 'waitlist'
                  ? 'Join the waitlist'
                  : 'Book an inspection'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{listing.title}</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close booking dialog"
            className="grid size-9 shrink-0 place-items-center rounded-full border hover:bg-muted"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        {state.ok ? (
          <div className="flex flex-col gap-3 p-5 sm:p-6" role="status">
            <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
            <h3 className="text-lg font-bold">Demo request validated</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{state.message}</p>
            <p className="text-xs text-muted-foreground">
              Reference <span className="font-mono font-semibold text-foreground">{state.reference}</span>
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <form action={action} className="flex flex-col gap-4 p-5 sm:p-6" noValidate>
            <input type="hidden" name="slug" value={listing.slug} />
            <input type="hidden" name="visitType" value={visitType} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {visitType === 'waitlist'
                ? 'Just your name and WhatsApp number. This preview does not submit a waitlist request.'
                : 'Just your name, WhatsApp number and a time that works.'}
            </p>
            <Field label="Your name" name="name" error={state.errors?.name} autoComplete="name" />
            <Field
              label="WhatsApp number"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="024 123 4567"
              error={state.errors?.phone}
              autoComplete="tel"
            />
            {visitType !== 'waitlist' && (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-semibold">How would you like to view?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  <VisitChoice
                    name="visitChoice"
                    checked={visitType === 'in-person'}
                    onChange={() => setVisitType('in-person')}
                  >
                    In person · GH₵{VIEWING_FEE}
                  </VisitChoice>
                  <VisitChoice
                    name="visitChoice"
                    checked={visitType === 'video-call'}
                    onChange={() => setVisitType('video-call')}
                  >
                    WhatsApp video · GH₵{VIEWING_FEE}
                  </VisitChoice>
                </div>
              </fieldset>
            )}
            {visitType !== 'waitlist' && (
              <fieldset className="flex min-w-0 flex-col gap-2">
                <legend className="mb-2 text-sm font-semibold">Preferred day</legend>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {days.map((day, index) => (
                    <Choice key={day.value} name="date" value={day.value} defaultChecked={index === 0}>
                      {day.label}
                    </Choice>
                  ))}
                </div>
                {state.errors?.date && <p className="text-xs text-destructive">{state.errors.date}</p>}
              </fieldset>
            )}
            {visitType !== 'waitlist' && (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-semibold">Preferred time</legend>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot, index) => (
                    <Choice key={slot.value} name="slot" value={slot.value} defaultChecked={index === 1}>
                      {slot.label}
                    </Choice>
                  ))}
                </div>
                {state.errors?.slot && <p className="text-xs text-destructive">{state.errors.slot}</p>}
              </fieldset>
            )}
            {state.message && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {state.message}
              </p>
            )}
            {visitType !== 'waitlist' && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                GH₵{VIEWING_FEE} per person. No booking is recorded and no fee is collected in this preview.
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {visitType === 'waitlist' ? 'Join waitlist' : 'Send request'}
            </button>
          </form>
        )}
      </dialog>
    </div>
  )
}
function CostRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="shrink-0 tabular">{value}</dd>
    </div>
  )
}
function Field({ label, name, error, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <input
        name={name}
        aria-invalid={Boolean(error)}
        className={cn(
          'h-11 rounded-lg border bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring',
          error && 'border-destructive',
        )}
        {...props}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}
function Choice({ name, value, defaultChecked, children }) {
  return (
    <label className="flex h-11 min-w-16 shrink-0 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} className="sr-only" />
      {children}
    </label>
  )
}
function VisitChoice({ name, checked, onChange, children }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="accent-primary" />
      {children}
    </label>
  )
}
