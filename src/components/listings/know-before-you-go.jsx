import {
    Bath,
    Bus,
    Car,
    CookingPot,
    Droplets,
    Globe2,
    Landmark,
    PawPrint,
    Route,
    ShieldCheck,
    Signpost,
    Umbrella,
    Volume2,
    Wifi,
    Zap,
  } from 'lucide-react'
  
  import {
    distance,
    floodLabel,
    internetLabel,
    kitchenLabel,
    longDate,
    powerLabel,
    roadLabel,
    walkMinutes,
    waterLabel,
  } from '../../lib/format'
  
  const statusLabels = {
    available: 'Available',
    inspecting: 'Inspection in progress',
    reserved: 'Reserved',
    rented: 'Rented',
    draft: 'Draft',
  }
  
  const NOT_RECORDED = 'Not recorded'
  
  export function KnowBeforeYouGo({
    a = {},
    visitedAt,
    visitedBy,
    listing,
  }) {
    const attributes = a ?? {}
  
    // Essential property information
  
    const mainFacts = [
      {
        icon: Route,
        label: 'Road condition',
        value: roadLabel[attributes.roadCondition],
      },
      {
        icon: Signpost,
        label: 'Distance from main road',
        value: Number.isFinite(attributes.distanceToMainRoadM)
          ? `${distance(attributes.distanceToMainRoadM)} · ${walkMinutes(attributes.distanceToMainRoadM)} min walk`
          : null,
      },
      {
        icon: Landmark,
        label: 'Nearest landmark',
        value: attributes.nearestLandmark
          ? [
              attributes.nearestLandmark,
              Number.isFinite(attributes.landmarkDistanceM)
                ? `${walkMinutes(attributes.landmarkDistanceM)} min walk`
                : null,
            ]
              .filter(Boolean)
              .join(' · ')
          : null,
      },
      {
        icon: Wifi,
        label: 'Internet availability',
        value: [
          internetLabel[attributes.internet],
          attributes.internetProviders?.join(', '),
        ]
          .filter(Boolean)
          .join(' · '),
      },
      {
        icon: Globe2,
        label: 'Foreigners accepted',
        value: booleanLabel(
          attributes.foreignersAccepted,
          'Yes — landlord confirmed',
          'No — landlord confirmed',
        ),
      },
      {
        icon: Droplets,
        label: 'Water supply',
        value: waterLabel[attributes.water],
      },
      {
        icon: Zap,
        label: 'Electricity',
        value: powerLabel[attributes.power],
      },
      {
        icon: CookingPot,
        label: 'Kitchen',
        value: ['shared', 'private'].includes(listing.kitchenAccess)
          ? kitchenLabel(listing)
          : null,
      },
      {
        icon: Bath,
        label: 'Toilet & bathroom',
        value:
          listing.bathroomAccess === 'shared'
            ? 'Shared toilet & bathroom'
            : listing.bathroomAccess === 'private'
              ? 'Private toilet & bathroom'
              : null,
      },
      {
        icon: ShieldCheck,
        label: 'Availability',
        value: availabilityText(listing),
      },
    ]
  
    // Additional property information
  
    const moreFacts = [
      {
        icon: Bus,
        label: 'Nearest trotro stop',
        value: attributes.nearestTrotroStop,
      },
      {
        icon: Umbrella,
        label: 'Flood risk',
        value: floodLabel[attributes.floodRisk],
      },
      {
        icon: ShieldCheck,
        label: 'Security',
        value: attributes.security,
      },
      {
        icon: Volume2,
        label: 'Noise',
        value: capitalize(attributes.noise),
      },
      {
        icon: Car,
        label: 'Parking',
        value: booleanLabel(
          attributes.parking,
          'Available',
          'Not available',
        ),
      },
      {
        icon: PawPrint,
        label: 'Pets',
        value: booleanLabel(
          attributes.petsAllowed,
          'Allowed',
          'Not allowed',
        ),
      },
    ].filter((fact) => fact.value != null && fact.value !== '')
  
    return (
      <section
        aria-labelledby="kbyg"
        className="border-t pt-5 sm:pt-6"
      >
        {/* Section heading and visit information */}
  
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="kbyg" className="text-2xl font-bold sm:text-3xl">
              Know before you go.
            </h2>
  
            <p className="mt-1 text-sm text-muted-foreground">
              The full picture, not just the pretty parts.
            </p>
          </div>
  
          {(visitedBy || visitedAt) && (
            <p className="text-xs text-muted-foreground">
              {visitedBy && (
                <>
                  Visited by{' '}
                  <strong className="text-foreground">
                    {visitedBy}
                  </strong>
                </>
              )}
  
              {visitedBy && visitedAt && ' · '}
  
              {visitedAt && longDate(visitedAt)}
            </p>
          )}
        </div>
  
        {/* Essential property facts */}
  
        <dl className="mt-5 grid gap-x-7 gap-y-5 sm:grid-cols-2 sm:gap-y-6">
          {mainFacts.map((fact) => (
            <Fact
              key={fact.label}
              {...fact}
            />
          ))}
        </dl>
  
        {/* Additional property facts */}
  
        {moreFacts.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold">
              More from the visit
            </h3>
  
            <dl className="mt-4 grid gap-x-7 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {moreFacts.map((fact) => (
                <Fact
                  key={fact.label}
                  {...fact}
                  compact
                />
              ))}
            </dl>
          </div>
        )}
  
        {/* Field inspection notes */}
  
        {attributes.notes && (
          <div className="mt-5 border-t pt-4">
            <p className="eyebrow">From the visit</p>
  
            <p className="mt-2 max-w-3xl leading-relaxed">
              {attributes.notes}
            </p>
          </div>
        )}
      </section>
    )
  }
  
  // Formatting helpers
  
  function booleanLabel(value, trueLabel, falseLabel) {
    if (value === true) return trueLabel
    if (value === false) return falseLabel
  
    return null
  }
  
  function capitalize(value) {
    if (typeof value !== 'string' || !value.trim()) return null
  
    const text = value.trim()
  
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
  
  function availabilityText(listing) {
    const status = statusLabels[listing.status] ?? NOT_RECORDED
  
    if (!listing.availabilityConfirmedAt) {
      return `${status} · not yet confirmed`
    }
  
    return `${status} · checked ${longDate(listing.availabilityConfirmedAt)}`
  }
  
  // Reusable property fact
  
  function Fact({
    icon: Icon,
    label,
    value,
    compact = false,
  }) {
    return (
      <div className="flex min-w-0 items-start gap-3">
        <Icon
          className={`${compact ? 'size-4' : 'size-5'} mt-0.5 shrink-0 text-primary`}
          strokeWidth={1.8}
          aria-hidden="true"
        />
  
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">
            {label}
          </dt>
  
          <dd
            className={`${compact ? 'mt-0.5 text-sm' : 'mt-1'} font-semibold leading-snug`}
          >
            {value || NOT_RECORDED}
          </dd>
        </div>
      </div>
    )
  }