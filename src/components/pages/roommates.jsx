import {
    BriefcaseBusiness,
    CalendarDays,
    MessageCircle,
  } from 'lucide-react'
  
  import { ghs, longDate } from '../../lib/format'
  
  const avatarStyles = [
    'bg-primary text-primary-foreground',
    'bg-accent text-accent-foreground',
    'bg-secondary text-secondary-foreground',
  ]
  
  export function RoommateCard({ person, index = 0, whatsappNumber }) {
    const name = person.displayName || 'Roommate'
    const initial = name.charAt(0).toUpperCase()
  
    const preferredAreas = (person.areas ?? [])
      .map((area) => area.name)
      .filter(Boolean)
      .join(' · ')
  
    const introductionMessage = encodeURIComponent(
      `Hi FieDirect, I'd like to be introduced to ${name} as a potential roommate. Profile reference: ${person.id}`,
    )
  
    return (
      <article className="flex h-full flex-col rounded-xl border bg-card p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-foreground/5 sm:p-6">
  
        {/* Profile information */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className={`grid size-14 shrink-0 place-items-center rounded-full font-display text-xl font-bold ${avatarStyles[index % avatarStyles.length]}`}
            >
              {initial}
            </span>
  
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold">
                {name}
                {Number.isInteger(person.age) && `, ${person.age}`}
              </h3>
  
              {person.occupation && (
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BriefcaseBusiness
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
  
                  {person.occupation}
                </p>
              )}
            </div>
          </div>
  
          {person.nationality && (
            <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
              {person.nationality}
            </span>
          )}
        </div>
  
        {/* About the person */}
        {person.about && (
          <p className="mt-5 leading-relaxed text-foreground/90">
            “{person.about}”
          </p>
        )}
  
        {/* Lifestyle preferences */}
        {person.lifestyle?.length > 0 && (
          <ul
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Lifestyle and preferences"
          >
            {person.lifestyle.map((trait) => (
              <li
                key={trait}
                className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {trait}
              </li>
            ))}
          </ul>
        )}
  
        {/* Budget and preferred location */}
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
          <div>
            <dt className="text-xs text-muted-foreground">
              Monthly budget
            </dt>
  
            <dd className="mt-1 font-display text-lg font-bold tabular">
              {Number.isFinite(person.budgetMonthly)
                ? ghs(person.budgetMonthly)
                : 'Not specified'}
            </dd>
          </div>
  
          <div>
            <dt className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays
                className="size-3.5"
                aria-hidden="true"
              />
  
              Move in by
            </dt>
  
            <dd className="mt-1 text-sm font-semibold">
              {person.moveInBy
                ? longDate(person.moveInBy)
                : 'Flexible'}
            </dd>
          </div>
  
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">
              Preferred areas
            </dt>
  
            <dd className="mt-1 text-sm font-medium">
              {preferredAreas || 'Not specified'}
            </dd>
          </div>
        </dl>
  
        {/* Introduction request */}
        {whatsappNumber && (
          <div className="mt-auto pt-5">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${introductionMessage}`}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle
                className="size-4"
                aria-hidden="true"
              />
  
              Ask FieDirect for an intro
            </a>
          </div>
        )}
      </article>
    )
  }