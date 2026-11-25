// Data access layer.
import { areas } from './areas'
import {
  listingAttributes,
  listingPhotos,
  listings,
} from './data/listings'
import { roommates } from './data/roommates'

const statusOrder = {
  inspecting: 0,
  available: 1,
  reserved: 2,
  rented: 3,
  draft: 4,
}

// Combine listing data with its related records

function hydrate(listing) {
  if (!listing || listing.status === 'draft') return null

  const area = areas.find(
    (area) => area.id === listing.areaId,
  )

  const attributes = listingAttributes.find(
    (attribute) => attribute.listingId === listing.id,
  )

  if (!area || !attributes) return null

  const photos = listingPhotos
    .filter((photo) => photo.listingId === listing.id)
    .sort((a, b) => a.position - b.position)

  return {
    ...listing,
    area,
    attributes,
    photos,
  }
}

// Retrieve listings with optional filters and sorting

export async function getListings(filters = {}) {
  const result = listings
    .map(hydrate)
    .filter(Boolean)
    .filter((listing) => {
      if (filters.area && listing.area.slug !== filters.area) {
        return false
      }

      if (filters.maxRent && listing.rentMonthly > filters.maxRent) {
        return false
      }

      if (filters.type && listing.type !== filters.type) {
        return false
      }

      if (filters.foreigners && !listing.attributes.foreignersAccepted) {
        return false
      }

      if (filters.tarred && listing.attributes.roadCondition !== 'tarred') {
        return false
      }

      if (filters.fibre && listing.attributes.internet !== 'fibre') {
        return false
      }

      if (filters.availableOnly && listing.status !== 'available') {
        return false
      }

      return true
    })

  return result.sort((a, b) => {
    const byStatus =
      (statusOrder[a.status] ?? 99) -
      (statusOrder[b.status] ?? 99)

    if (byStatus !== 0) return byStatus

    if (filters.sort === 'price-asc') {
      return a.rentMonthly - b.rentMonthly
    }

    if (filters.sort === 'price-desc') {
      return b.rentMonthly - a.rentMonthly
    }

    return (b.visitedAt ?? '').localeCompare(a.visitedAt ?? '')
  })
}

// Retrieve a single listing by its URL slug

export async function getListingBySlug(slug) {
  const listing = listings.find(
    (listing) => listing.slug === slug,
  )

  return hydrate(listing)
}

// Retrieve listings by their IDs

export async function getListingsByIds(ids = []) {
  const listingsById = new Map(
    listings.map((listing) => [listing.id, listing]),
  )

  return ids
    .map((id) => hydrate(listingsById.get(id)))
    .filter(Boolean)
}

// Retrieve areas and their available property counts

export async function getAreas() {
  return areas.map((area) => ({
    ...area,
    availableCount: listings.filter(
      (listing) =>
        listing.areaId === area.id &&
        listing.status === 'available',
    ).length,
  }))
}

// Retrieve roommate profiles with optional area filtering

export async function getRoommates(area) {
  return roommates
    .map((roommate) => ({
      ...roommate,
      areas: areas.filter((item) =>
        roommate.preferredAreaIds.includes(item.id),
      ),
    }))
    .filter(
      (roommate) =>
        !area ||
        roommate.areas.some((item) => item.slug === area),
    )
}