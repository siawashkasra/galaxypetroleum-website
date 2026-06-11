import Hero from '@/components/sections/Hero'
import LivePrices from '@/components/sections/LivePrices'
import Stats from '@/components/sections/Stats'
import About from '@/components/sections/About'
import Journey from '@/components/sections/Journey'
import Commodities from '@/components/sections/Commodities'
import Services from '@/components/sections/Services'
import Projects from '@/components/sections/Projects'
import Network from '@/components/sections/Network'
import CeoMessage from '@/components/sections/CeoMessage'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import {
  getCompany,
  getStats,
  getTestimonials,
  getProjects,
  getServices,
  getProducts,
  getJourneyImpactStats,
  getCeoMessage,
} from '@/lib/db'

export default function Home() {
  const company        = getCompany()
  const stats          = getStats()
  const testimonials   = getTestimonials()
  const projects       = getProjects()
  const services       = getServices()
  const products       = getProducts()
  const journeyStats   = getJourneyImpactStats()
  const ceoMessage     = getCeoMessage()

  return (
    <main>
      <Hero />
      <LivePrices />
      <Stats stats={stats} />
      <About company={company} />
      <Journey journeyImpactStats={journeyStats} />
      <Commodities products={products} />
      <Services services={services} />
      <Projects projects={projects} />
      <Network />
      <CeoMessage ceoMessage={ceoMessage} />
      <Testimonials testimonials={testimonials} />
      <Contact company={company} />
    </main>
  )
}
