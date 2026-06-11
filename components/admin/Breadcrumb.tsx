'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

const LABELS: Record<string, string> = {
  '/admin':              'Dashboard',
  '/admin/company':      'Company Info',
  '/admin/stats':        'Stats',
  '/admin/testimonials': 'Testimonials',
  '/admin/ceo-message':  'CEO Message',
  '/admin/projects':     'Projects',
  '/admin/commodities':  'Commodities',
  '/admin/services':     'Services',
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const isRoot   = pathname === '/admin'

  const crumbs: { href: string; label: string }[] = [
    { href: '/admin', label: 'Dashboard' },
  ]

  if (!isRoot) {
    crumbs.push({ href: pathname, label: LABELS[pathname] ?? 'Page' })
  }

  return (
    <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={13} style={{ color: '#c4c1b9' }} />}
            {isLast ? (
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#1a1906' }}>
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                style={{ fontSize: '13px', color: '#9a978f' }}
                className="hover:text-amber-700 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
