import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { getCompany } from '@/lib/db'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const company = getCompany()
  return (
    <>
      <Navbar email={company.email} />
      {children}
      <Footer />
      <WhatsAppButton whatsapp={company.whatsapp} />
    </>
  )
}
