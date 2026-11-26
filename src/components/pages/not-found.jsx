import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-24">
      <p className="text-sm font-bold uppercase tracking-wider text-primary">
        404
      </p>

      <h1 className="text-4xl font-bold text-balance">
        We couldn't find that one.
      </h1>

      <p className="leading-relaxed text-muted-foreground">
        At least you didn't pay transport to find out.
        The page may have been removed or the home may
        have already been rented.
      </p>

      <Link
        to="/listings"
        className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Browse available homes
      </Link>
    </div>
  )
}