import { requireAuth } from '@/lib/session'
import Link from 'next/link'

const SECTIONS = [
  { href: '/admin/company',      label: 'Company Info',  desc: 'Tagline, about text, contact details'  },
  { href: '/admin/stats',        label: 'Stats',         desc: 'Key numbers shown on the homepage'     },
  { href: '/admin/testimonials', label: 'Testimonials',  desc: 'Client quotes — add, edit, delete'     },
  { href: '/admin/ceo-message',   label: 'CEO Message',   desc: 'CEO quote, photo, and message text'    },
  { href: '/admin/projects',     label: 'Projects',      desc: 'Featured projects — add, edit, delete' },
  { href: '/admin/commodities',  label: 'Commodities',   desc: 'Product descriptions, specs, images'   },
  { href: '/admin/services',     label: 'Services',      desc: 'Service titles and descriptions'       },
]

export default async function AdminDashboard() {
  await requireAuth()

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>
        Dashboard
      </h1>
      <p style={{ fontSize: '13px', color: '#9a978f', marginBottom: '32px' }}>
        Select a section to manage content.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="block rounded-sm bg-white p-6 transition-shadow hover:shadow-md"
            style={{ border: '1px solid #e5e3dc' }}
          >
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>{label}</p>
            <p style={{ fontSize: '12px', color: '#9a978f' }}>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
