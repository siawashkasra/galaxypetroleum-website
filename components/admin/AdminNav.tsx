'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',              label: 'Dashboard'    },
  { href: '/admin/company',      label: 'Company Info' },
  { href: '/admin/stats',        label: 'Stats'        },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/ceo-message',   label: 'CEO Message'  },
  { href: '/admin/projects',     label: 'Projects'     },
  { href: '/admin/commodities',  label: 'Commodities'  },
  { href: '/admin/services',     label: 'Services'     },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 py-2">
      {NAV.map(({ href, label }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-6 py-2.5 text-[13px] transition-colors duration-150"
            style={{
              color:      active ? '#C9A84C' : '#5a5750',
              background: active ? '#fdf9f0' : 'transparent',
              borderLeft: active ? '2px solid #C9A84C' : '2px solid transparent',
              fontWeight: active ? 500 : 400,
            }}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
