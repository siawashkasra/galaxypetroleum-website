import Link from 'next/link'
import Image from 'next/image'
import { company } from '@/lib/data'

const WA_NUMBER  = company.whatsapp.replace(/\D/g, '')
const WA_MESSAGE = encodeURIComponent(
  "Hello, I'd like to inquire about Galaxy Petroleum's fuel products and services.",
)

const NAV_COLS = [
  {
    heading: 'Company',
    links: [
      { label: 'About',        href: '#about'        },
      { label: 'The Journey',  href: '#journey'      },
      { label: 'Projects',     href: '#projects'     },
      { label: 'Our Network',  href: '#network'      },
      { label: 'Team',         href: '#team'         },
      { label: 'Testimonials', href: '#testimonials' },
    ],
  },
  {
    heading: 'Products',
    links: [
      { label: 'Petrol AI 92', href: '#products' },
      { label: 'Petrol AI 95', href: '#products' },
      { label: 'Diesel',       href: '#products' },
      { label: 'LPG',          href: '#products' },
      { label: 'Services',     href: '#services' },
      { label: 'Market Prices',href: '#prices'   },
    ],
  },
]

const CONTACT_ITEMS = [
  { label: 'Email',    value: company.email,          href: `mailto:${company.email}`                              },
  { label: 'Phone',    value: company.phone,          href: `tel:${company.phone.replace(/\s/g, '')}`             },
  { label: 'Address',  value: company.headquarters,   href: '#contact'                                             },
  { label: 'WhatsApp', value: 'Chat with us',         href: `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`       },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      aria-label="Site footer"
      style={{ background: '#080808' }}
    >
      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-10 lg:pt-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]">

          {/* Brand column */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            {/* Logo text */}
            <div>
              <Image
                src="/logo.png"
                alt="Galaxy Petroleum"
                width={180}
                height={64}
                className="h-14 w-auto object-contain"
              />
            </div>

            <p className="max-w-xs text-[13px] leading-7 text-white/45">
              {company.tagline}. Afghanistan&rsquo;s premier petroleum import
              and distribution company — established {company.founded} in
              Kabul.
            </p>

            {/* Gold accent line */}
            <div aria-hidden="true" className="h-px w-10 bg-gold opacity-50" />

            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
              Sourcing from 6 nations &nbsp;·&nbsp; 4 border crossings
              &nbsp;·&nbsp; 34 provinces served
            </p>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(col => (
            <div key={col.heading}>
              <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-gold">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-white/50 transition-colors duration-200 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-gold">
              Contact
            </p>
            <ul className="space-y-4">
              {CONTACT_ITEMS.map(({ label, value, href }) => (
                <li key={label}>
                  <p className="mb-0.5 text-[9px] uppercase tracking-[0.18em] text-white/25">
                    {label}
                  </p>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-[13px] text-white/55 transition-colors duration-200 hover:text-gold"
                  >
                    {value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-[10px] uppercase tracking-[0.18em] text-white/25 sm:flex-row lg:px-10">
          <p>
            &copy; {year} Galaxy Petroleum. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Kabul, Afghanistan</span>
            <span aria-hidden="true">·</span>
            <a href="#contact" className="transition-colors duration-200 hover:text-white/60">
              Privacy Policy
            </a>
            <a href="#contact" className="transition-colors duration-200 hover:text-white/60">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
