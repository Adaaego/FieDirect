import { useSearchParams } from 'react-router-dom'
import { listingTypeLabel, ghs } from '../../lib/format'

const toggles = [
  { name: 'foreigners', label: 'Foreigners welcome' },
  { name: 'tarred', label: 'Tarred road' },
  { name: 'fibre', label: 'Fibre internet' },
  { name: 'available', label: 'Available only' },
]

const rentOptions = [1000, 1500, 2500, 5000, 8000]

const selectClass =
  'h-10 w-full rounded-lg border bg-card px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function ListingFilters({ areas = [] }) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Update filters in the URL
  function update(form) {
    const params = new URLSearchParams()

    for (const [key, value] of new FormData(form)) {
      if (typeof value === 'string' && value !== '') {
        params.set(key, value)
      }
    }

    setSearchParams(params, { replace: true })
  }

  return (
    <form
      onChange={(event) => update(event.currentTarget)}
      onSubmit={(event) => {
        event.preventDefault()
        update(event.currentTarget)
      }}
      className="flex flex-col gap-4"
    >
      {/* Primary listing filters */}

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">

        {/* Area */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Area
          </span>

          <select
            name="area"
            value={searchParams.get('area') ?? ''}
            onChange={() => {}}
            className={selectClass}
          >
            <option value="">All areas</option>

            {areas.map((area) => (
              <option key={area.id} value={area.slug}>
                {area.name}
              </option>
            ))}
          </select>
        </label>

        {/* Maximum monthly rent */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Max rent / month
          </span>

          <select
            name="maxRent"
            value={searchParams.get('maxRent') ?? ''}
            onChange={() => {}}
            className={selectClass}
          >
            <option value="">Any</option>

            {rentOptions.map((rent) => (
              <option key={rent} value={rent}>
                {ghs(rent)}
              </option>
            ))}
          </select>
        </label>

        {/* Property type */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Type
          </span>

          <select
            name="type"
            value={searchParams.get('type') ?? ''}
            onChange={() => {}}
            className={selectClass}
          >
            <option value="">Any type</option>

            {Object.entries(listingTypeLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {/* Sorting */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Sort
          </span>

          <select
            name="sort"
            value={searchParams.get('sort') ?? 'newest'}
            onChange={() => {}}
            className={selectClass}
          >
            <option value="newest">Newest visit</option>
            <option value="price-asc">Cheapest first</option>
            <option value="price-desc">Priciest first</option>
          </select>
        </label>
      </div>

      {/* Property attribute filters */}

      <fieldset>
        <legend className="sr-only">
          Know before you go filters
        </legend>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {toggles.map((toggle) => (
            <label
              key={toggle.name}
              className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full border bg-card px-4 text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            >
              <input
                type="checkbox"
                name={toggle.name}
                value="1"
                checked={searchParams.get(toggle.name) === '1'}
                onChange={() => {}}
                className="sr-only"
              />

              {toggle.label}
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  )
}