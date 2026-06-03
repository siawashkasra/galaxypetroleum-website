import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Cormorant_Garamond, Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Galaxy Petroleum — Afghanistan's Premier Energy Partner",
    template: '%s | Galaxy Petroleum',
  },
  description:
    'Galaxy Petroleum imports and distributes world-class petroleum products across Afghanistan. Trusted supplier of AI 92, AI 95, Diesel, and LPG sourced from Russia, Azerbaijan, Iraq, Turkmenistan, and beyond.',
  keywords: [
    'petroleum Afghanistan',
    'fuel import Afghanistan',
    'Galaxy Petroleum',
    'AI 92 Kabul',
    'diesel Afghanistan',
    'LPG Afghanistan',
    'petroleum supplier Kabul',
    'energy Afghanistan',
  ],
  authors: [{ name: 'Galaxy Petroleum' }],
  creator: 'Galaxy Petroleum',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://galaxypetroleum.com',
    siteName: 'Galaxy Petroleum',
    title: "Galaxy Petroleum — Afghanistan's Premier Energy Partner",
    description:
      'Supplying Afghanistan with world-class petroleum products through established global networks.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Galaxy Petroleum — Afghanistan's Premier Energy Partner",
    description:
      'Supplying Afghanistan with world-class petroleum products through established global networks.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor: '#C9A84C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${cormorantGaramond.variable}`}
      suppressHydrationWarning
    >
      {/* flag-icons CSS — renders real country flag images for the Journey section */}
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/css/flag-icons.min.css"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
