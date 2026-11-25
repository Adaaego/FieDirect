import { getListingBySlug } from './queries'
import { listingMoveInCost, VIEWING_FEE, ghs } from './format'

const GH_PHONE = /^(?:\+?233|0)[235]\d{8}$/

const INSPECTION_SLOTS = ['09:00', '11:00', '14:00', '16:00']

const VISIT_TYPES = ['in-person', 'video-call']

const PAYMENT_METHODS = [
  'momo-mtn',
  'momo-telecel',
  'momo-at',
  'card',
  'bank',
]

// Shared validation utilities

function clean(value, max = 120) {
  return typeof value === 'string'
    ? value.trim().slice(0, max)
    : ''
}

function cleanPhone(value) {
  return clean(value, 20).replace(/[\s-]/g, '')
}

function validationError(errors) {
  return {
    ok: false,
    message: 'Please check the highlighted fields.',
    errors,
  }
}

// Generate temporary demo references

function reference(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

// Inspection booking

export async function bookInspection(_previous, formData) {
  const slug = clean(formData.get('slug'))
  const name = clean(formData.get('name'), 80)
  const phone = cleanPhone(formData.get('phone'))
  const date = clean(formData.get('date'), 10)
  const slot = clean(formData.get('slot'), 10)
  const visitType = clean(formData.get('visitType'), 20)

  const errors = {}

  // Validate contact information

  if (name.length < 2) {
    errors.name = 'Tell us your name so the team knows who to meet.'
  }

  if (!GH_PHONE.test(phone)) {
    errors.phone = 'Enter a Ghana number, e.g. 024 123 4567.'
  }

  if (Object.keys(errors).length) {
    return validationError(errors)
  }

  // Retrieve listing and check availability

  const listing = await getListingBySlug(slug)

  if (!listing || !['available', 'inspecting', 'reserved'].includes(listing.status)) {
    return {
      ok: false,
      message: 'This home is no longer available. Try one of the similar homes below.',
    }
  }

  if (listing.status === 'inspecting') {
    return {
      ok: false,
      message: 'A viewing is already underway. Ask the team for an update before you travel.',
    }
  }

  // Handle reserved properties

  if (listing.status === 'reserved') {
    if (visitType !== 'waitlist') {
      return {
        ok: false,
        message: 'This home is reserved. Join the waitlist instead.',
      }
    }

    return {
      ok: true,
      reference: reference('WAIT'),
      message:
        'Demo only: your waitlist request has been validated. No request has been recorded and no fee has been collected.',
    }
  }

  // Validate inspection details

  if (!VISIT_TYPES.includes(visitType)) {
    errors.visitType = 'Choose an in-person or WhatsApp video visit.'
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Pick a day.'
  }

  if (!INSPECTION_SLOTS.includes(slot)) {
    errors.slot = 'Pick a time.'
  }

  if (Object.keys(errors).length) {
    return validationError(errors)
  }

  const viewingType =
    visitType === 'video-call'
      ? 'WhatsApp video call'
      : 'in-person viewing'

  // Temporary response until Firebase integration

  return {
    ok: true,
    reference: reference('INS'),
    message: `Demo only: your ${viewingType} request has been validated. The inspection fee is ${ghs(VIEWING_FEE)}. No booking has been recorded and no fee has been collected.`,
  }
}

// Rental payment initiation

export async function startPayment(_previous, formData) {
  const slug = clean(formData.get('slug'))
  const method = clean(formData.get('method'), 20)
  const phone = cleanPhone(formData.get('phone'))
  const paymentMonths = Number(
    clean(formData.get('paymentMonths'), 3),
  )
  const agree = formData.get('agree') === 'on'

  const errors = {}

  // Validate payment information

  if (!PAYMENT_METHODS.includes(method)) {
    errors.method = 'Choose how you want to pay.'
  }

  if (method.startsWith('momo') && !GH_PHONE.test(phone)) {
    errors.phone = 'Enter the MoMo number to charge.'
  }

  if (!agree) {
    errors.agree =
      'Please confirm you have inspected the home and reviewed the charges.'
  }

  if (Object.keys(errors).length) {
    return validationError(errors)
  }

  // Verify listing availability

  const listing = await getListingBySlug(slug)

  if (!listing || listing.status !== 'available') {
    return {
      ok: false,
      message: 'This home can’t be secured right now. Contact our team for an update.',
    }
  }

  // Validate rent advance duration

  const allowedDurations = listing.paymentDurations?.length
    ? listing.paymentDurations
    : [listing.advanceMonths]

  if (
    !Number.isInteger(paymentMonths) ||
    paymentMonths <= 0 ||
    !allowedDurations.includes(paymentMonths)
  ) {
    return {
      ok: false,
      message: 'Choose one of the payment durations shown for this home.',
      errors: {
        paymentMonths: 'Choose an available rent advance.',
      },
    }
  }

  // Calculate total move-in cost

  const cost = listingMoveInCost(listing, paymentMonths)

  // Temporary response until payment integration

  return {
    ok: true,
    reference: reference('FD'),
    message: `Demo only: no payment was taken. Your ${paymentMonths}-month rent advance, deposit and ${Math.round(cost.feeRate * 100)}% FieDirect fee total ${ghs(cost.total)}.`,
  }
}