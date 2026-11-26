import { Routes, Route } from 'react-router-dom'

// Shared layout
import { SiteHeader } from './components/layout/site-header'

import { SiteFooter } from './components/layout/site-footer'

// Pages
// Pages
import HomePage from './components/pages/home'
import ListingsPage from './components/pages/listings'
import ListingDetailsPage from './components/pages/listing-details'
import ListingPaymentPage from './components/pages/listing-payment'
import RoommatesPage from './components/pages/roommates'
import HowItWorksPage from './components/pages/how-it-works'
import AreasPage from './components/pages/areas'
import SavedPage from './components/pages/saved'
import NotFound from './components/pages/not-found'


function App() {
  return (
    <div className="flex min-h-dvh flex-col">

      {/* Accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-ink-foreground"
      >
        Skip to content
      </a>

      {/* Site header */}
      <SiteHeader />

      {/* Page routes */}
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/listings" element={<ListingsPage />} />

          <Route
            path="/listings/:slug"
            element={<ListingDetailsPage />}
          />

          <Route
            path="/listings/:slug/pay"
            element={<ListingPaymentPage />}
          />

          <Route path="/roommates" element={<RoommatesPage />} />

          <Route path="/how-it-works" element={<HowItWorksPage />} />

          <Route path="/areas" element={<AreasPage />} />

          <Route path="/saved" element={<SavedPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Site footer */}
      <SiteFooter />
    </div>
  )
}

export default App