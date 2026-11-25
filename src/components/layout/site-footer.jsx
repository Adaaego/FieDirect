import { Link, useLocation } from 'react-router-dom'
import { Logo } from '../shared/logo'

export function SiteFooter() {
  const { pathname } = useLocation()

  if (pathname.startsWith('/team')) return null

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="page-wrap grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr]">

        {/* Brand and description */}
        <div className="flex max-w-sm flex-col gap-4">
          <Logo inverted />

          <p className="text-sm leading-relaxed text-ink-foreground/70">
            Every house on FieConnect has been visited by our team.
            We take the photos, ask the awkward questions and write
            down the answers. 7–10% service fee by lease length.
            GH₵70 per viewing. No surprises.
          </p>
        </div>

        {/* Renter navigation */}
        <nav
          aria-label="Renters"
          className="flex flex-col gap-3 text-sm"
        >
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-signal">
            Renters
          </h2>

          <Link
            to="/listings"
            className="text-ink-foreground/80 hover:text-ink-foreground"
          >
            Browse homes
          </Link>

          <Link
            to="/areas"
            className="text-ink-foreground/80 hover:text-ink-foreground"
          >
            Area guides
          </Link>

          <Link
            to="/roommates"
            className="text-ink-foreground/80 hover:text-ink-foreground"
          >
            Find a roommate
          </Link>

          <a
            href="/#faq"
            className="text-ink-foreground/80 hover:text-ink-foreground"
          >
            FAQ
          </a>
        </nav>

        {/* Contact information */}
        <div className="flex flex-col gap-3 text-sm">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-signal">
            Talk to us
          </h2>

          <a
            href="https://wa.me/233000000000"
            className="text-ink-foreground/80 hover:text-ink-foreground"
          >
            WhatsApp the team
          </a>

          <a
            href="mailto:hello@fieconnect.com"
            className="text-ink-foreground/80 hover:text-ink-foreground"
          >
            hello@fieconnect.com
          </a>

          <p className="text-ink-foreground/60">
            Mon–Sat, 8am–7pm GMT
          </p>

          <Link
            to="/team"
            className="text-ink-foreground/40 hover:text-ink-foreground"
          >
            Team login
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-ink-foreground/10">
        <p className="page-wrap py-5 text-xs text-ink-foreground/50">
          © {new Date().getFullYear()} FieConnect, Accra. Fie means home.
        </p>
      </div>
    </footer>
  )
}