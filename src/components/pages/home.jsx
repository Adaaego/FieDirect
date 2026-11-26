import { Hero } from '../home/hero'
import { HomeShowcase } from '../home/showcase'
import { FeeCalculator } from '../home/fee-calculator'
import { Faq } from '../home/faq'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeShowcase />
      <FeeCalculator />
      <Faq />
    </>
  )
}