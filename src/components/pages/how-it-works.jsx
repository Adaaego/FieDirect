import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  KeyRound,
  MessageCircle,
  Search,
  ShieldCheck,
  WalletCards,
} from 'lucide-react'

import {
  ghs,
  VIEWING_FEE,
  FIEDIRECT_SHORT_TERM_FEE,
  FIEDIRECT_LONG_TERM_FEE,
} from '../../lib/format'

const viewingFee = ghs(VIEWING_FEE)

const serviceFee = `${Math.round(FIEDIRECT_LONG_TERM_FEE * 100)}–${Math.round(FIEDIRECT_SHORT_TERM_FEE * 100)}%`

const steps = [
  {
    icon: Search,
    title: 'Find a place that fits',
    detail:
      'Browse real homes with clear rent, advance terms, photos and the details you need before you travel.',
    proof: [
      'Road and main-road distance',
      'Water, power and internet',
      'Landlord-confirmed availability',
    ],
  },
  {
    icon: ClipboardCheck,
    title: 'See it for yourself',
    detail:
      `Choose a time for a ${viewingFee} viewing. A FieDirect team member meets you at the gate and walks you through the home.`,
    proof: [
      `${viewingFee} per person`,
      'Meet at the gate',
      'No pressure to take it',
    ],
  },
  {
    icon: KeyRound,
    title: 'Agree, pay and move in',
    detail:
      'When you are happy, we confirm the full amount, prepare the tenancy agreement and stay with you through handover.',
    proof: [
      'One clear payment breakdown',
      `${serviceFee} service fee based on lease length`,
      'A real person to call',
    ],
  },
]

const assurances = [
  {
    icon: ShieldCheck,
    title: 'We visit before we list',
    body:
      'Our team checks the home and records the practical details agents often leave out.',
  },
  {
    icon: WalletCards,
    title: 'You see the full cost',
    body:
      `Advance rent, the ${viewingFee} viewing fee, utilities and any security deposit are shown upfront. No surprise charges.`,
  },
  {
    icon: MessageCircle,
    title: 'You are not on your own',
    body:
      'From your first question to the day you get the keys, our team is here to help.',
  },
]

export default function HowItWorksPage({ whatsappNumber = '' }) {
  const whatsapp = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hi FieDirect, I have a question.',
      )}`
    : null

  return (
    <div>
      {/* Page introduction */}
      <section className="bg-secondary">
        <div className="page-wrap py-10 sm:py-14">
          <p className="eyebrow">
            A better way to rent in Accra
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-balance sm:text-5xl lg:text-6xl">
            From first look to front door, with someone on your side.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Find a home, visit with confidence and move in knowing
            what you are paying for. No runaround. No guesswork.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <BrowseHomesLink>Find a home</BrowseHomesLink>

            <span className="inline-flex h-11 items-center gap-2 rounded-lg border bg-card px-4 text-sm font-medium">
              <Check
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Viewing fee {viewingFee}
            </span>
          </div>
        </div>
      </section>

      {/* Rental process */}
      <section
        className="page-wrap py-9 sm:py-12"
        aria-labelledby="steps-heading"
      >
        <div className="flex flex-col gap-2 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">
              Three steps. One team.
            </p>

            <h2
              id="steps-heading"
              className="mt-1 text-2xl font-bold sm:text-3xl"
            >
              A clearer way from search to keys.
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            You choose the home. We handle the legwork.
          </p>
        </div>

        <ol className="grid md:grid-cols-3">
          {steps.map(({ icon: Icon, title, detail, proof }, index) => (
            <li
              key={title}
              className="border-b py-6 md:border-b-0 md:py-8 md:not-first:border-l md:not-first:pl-6 md:not-last:pr-6"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
                  <Icon
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <span className="font-display text-sm font-semibold tracking-widest text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold sm:text-2xl">
                {title}
              </h3>

              <p className="mt-2 min-h-16 max-w-md leading-relaxed text-muted-foreground">
                {detail}
              </p>

              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {proof.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className="size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />

                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* FieDirect service assurances */}
      <section
        className="bg-ink text-ink-foreground"
        aria-labelledby="promise-heading"
      >
        <div className="page-wrap py-9 sm:py-12">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.5fr] lg:gap-12">
            <div className="flex flex-col gap-2">
              <p className="eyebrow text-signal">
                The FieDirect difference
              </p>

              <h2
                id="promise-heading"
                className="text-2xl font-bold text-balance sm:text-3xl"
              >
                The little details are the big details.
              </h2>
            </div>

            <ul className="grid gap-6 sm:grid-cols-3">
              {assurances.map(({ icon: Icon, title, body }) => (
                <li
                  key={title}
                  className="flex flex-col gap-2 border-t border-ink-foreground/15 pt-4"
                >
                  <Icon
                    className="size-6 text-signal"
                    aria-hidden="true"
                  />

                  <h3 className="font-semibold">
                    {title}
                  </h3>

                  <p className="text-sm leading-relaxed text-ink-foreground/70">
                    {body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="page-wrap py-8 sm:py-10">
        <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">
              Ready when you are
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Let's find your place in Accra.
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Browse homes or ask our team a question.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <BrowseHomesLink>
              Browse homes
            </BrowseHomesLink>

            {whatsapp && (
              <a
                href={whatsapp}
                className="inline-flex h-11 items-center gap-2 rounded-lg border bg-card px-5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                <MessageCircle
                  className="size-4"
                  aria-hidden="true"
                />

                Talk to us
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

// Reusable navigation link

function BrowseHomesLink({ children }) {
  return (
    <Link
      to="/listings"
      className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}

      <ArrowRight
        className="size-4"
        aria-hidden="true"
      />
    </Link>
  )
}