import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Menu, MessageCircle, X } from 'lucide-react'
import { Logo } from '../shared/logo'
import { useSaved } from '../../context/saved-provider'
import { cn } from '../../lib/utils'

const nav = [
  { href: '/listings', label: 'Find a home' },
  { href: '/roommates', label: 'Find a roommate' },
  { href: '/how-it-works', label: 'How it works' },
]

const whatsapp =
  'https://wa.me/233000000000?text=Hi%20FieConnect%2C%20I%27m%20looking%20for%20a%20place'

export function SiteHeader() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const { savedIds } = useSaved()

  if (pathname.startsWith('/team')) return null

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="page-wrap flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 lg:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={cn(
                'rounded-md px-3 py-2 text-[15px] font-medium text-foreground/80 transition-colors hover:text-primary',
                pathname === item.href && 'text-primary',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Header actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            to="/saved"
            className="relative inline-flex h-10 items-center gap-2 rounded-md px-2 text-[15px] font-medium hover:text-primary sm:px-3"
            aria-label={`Saved homes (${savedIds.length})`}
          >
            <Heart className="size-5" aria-hidden="true" />

            <span className="hidden sm:inline">Saved</span>

            {savedIds.length > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-signal text-[11px] font-bold text-primary-foreground tabular">
                {savedIds.length}
              </span>
            )}
          </Link>

          <a
            href={whatsapp}
            className="hidden h-10 items-center gap-2 rounded-lg border bg-card px-4 text-[15px] font-medium shadow-xs transition-colors hover:border-primary hover:text-primary sm:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Talk to the team
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="grid size-10 cursor-pointer place-items-center rounded-md hover:bg-muted lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((previous) => !previous)}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="animate-in fade-in slide-in-from-top-2 border-t bg-card lg:hidden"
        >
          <ul className="page-wrap flex flex-col py-2">
            {[...nav, { href: '/saved', label: 'Saved homes' }].map(
              (item) => (
                <li
                  key={item.href}
                  className="border-b last:border-0"
                >
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={
                      pathname === item.href ? 'page' : undefined
                    }
                    className={cn(
                      'flex h-12 items-center text-base font-medium',
                      pathname === item.href && 'text-primary',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}

            <li>
              <a
                href={whatsapp}
                className="flex h-12 items-center gap-2 text-base font-medium text-primary"
              >
                <MessageCircle
                  className="size-4"
                  aria-hidden="true"
                />
                Talk to the team on WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}