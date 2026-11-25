// Pricing constants

export const FIEDIRECT_SHORT_TERM_FEE = 0.1
export const FIEDIRECT_LONG_TERM_FEE = 0.07
export const TYPICAL_AGENT_FEE = 0.1
export const VIEWING_FEE = 70

// Pricing and cost calculations
export function serviceFeeRate(advanceMonths) {
    return advanceMonths < 6
      ? FIEDIRECT_SHORT_TERM_FEE
      : FIEDIRECT_LONG_TERM_FEE
  }

export function moveInCost(rentMonthly, advanceMonths) {
  const rent = rentMonthly * advanceMonths
  const feeRate = serviceFeeRate(advanceMonths)
  const fee = rent * feeRate
  const agentFee = rent * TYPICAL_AGENT_FEE

  return {
    rent,
    fee,
    feeRate,
    total: rent + fee,
    agentFee,
    saving: agentFee - fee,
  }
}

export function listingMoveInCost(
  listing,
  advanceMonths = listing.advanceMonths,
) {
  const costs = moveInCost(listing.rentMonthly, advanceMonths)

  const securityDeposit = listing.securityDeposit ?? 0
  const utilityFeeMonthly = listing.utilityFeeMonthly ?? 0
  const landlordTotal = costs.rent + securityDeposit

  return {
    ...costs,
    securityDeposit,
    utilityFeeMonthly,
    landlordTotal,
    total: landlordTotal + costs.fee,
  }
}

// Currency formatting

const cedi = new Intl.NumberFormat('en-GH', {
  maximumFractionDigits: 0,
})

export function ghs(amount) {
  return `GH₵${cedi.format(amount)}`
}

// Distance and walking time

export function distance(meters) {
  if (meters < 1000) return `${meters} m`

  return `${(meters / 1000).toFixed(1)} km`
}

export function walkMinutes(meters) {
  return Math.max(1, Math.round(meters / 80))
}

// Date formatting

export function shortDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

export function longDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function daysAgo(iso, now = new Date()) {
  const diff = Math.floor(
    (now.getTime() - new Date(iso).getTime()) / 86_400_000,
  )

  if (diff <= 0) return 'today'
  if (diff === 1) return 'yesterday'

  return `${diff} days ago`
}

// Property attribute labels

export const listingTypeLabel = {
  'single-room': 'Single room',
  'chamber-and-hall': 'Chamber & hall',
  'self-contained': 'Self-contained',
  studio: 'Studio',
  '1-bedroom': '1 bedroom',
  '2-bedroom': '2 bedroom',
  '3-bedroom': '3 bedroom',
}

export const roadLabel = {
  tarred: 'Tarred all the way',
  'untarred-good': 'Untarred, but smooth',
  'untarred-rough': 'Untarred and rough',
}

export const internetLabel = {
  fibre: 'Fibre available',
  '4g-strong': 'Strong 4G',
  '4g-patchy': 'Patchy 4G',
}

export const waterLabel = {
  'mains-reliable': 'Mains, flows daily',
  'mains-with-tank': 'Mains + backup tank',
  'tank-only': 'Tank, refilled by truck',
  borehole: 'Borehole',
}

export const powerLabel = {
  'prepaid-own-meter': 'Prepaid, own meter',
  'prepaid-shared-meter': 'Prepaid, shared meter',
  postpaid: 'Postpaid',
}

export const floodLabel = {
  none: 'No flooding seen',
  low: 'Low — gutters cope',
  moderate: 'Floods in heavy rain',
}

// Lease duration formatting

export function durationLabel(months) {
  if (months === 1) return '1 month'
  if (months === 12) return '1 year'

  return `${months} months`
}

export function durationOptionsLabel(durations = []) {
  return durations.map(durationLabel).join(' / ')
}

// Kitchen access formatting

export function kitchenLabel(listing) {
  if (listing.kitchenAccess !== 'shared') {
    return 'Private kitchen'
  }

  const count = listing.kitchenSharedWith

  return Number.isInteger(count)
    ? `Shared kitchen with ${count} other tenant${count === 1 ? '' : 's'}`
    : 'Shared kitchen'
}