import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function Logo({ inverted = false, className }) {
  return (
    <Link
      to="/"
      aria-label="FieDirect home"
      className="inline-flex w-fit shrink-0 items-center"
    >
      <img
        src={
          inverted
            ? '/fiedirect-logo-light.png'
            : '/fiedirect-logo-dark.png'
        }
        alt="FieDirect"
        className={cn(
          'h-12 w-auto object-contain',
          className,
        )}
      />
    </Link>
  )
}