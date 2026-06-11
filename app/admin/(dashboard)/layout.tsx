import AdminNav from '@/components/admin/AdminNav'
import Breadcrumb from '@/components/admin/Breadcrumb'
import { logout } from '@/app/actions/admin'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#f5f4f0' }}>
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside
        className="flex w-56 flex-shrink-0 flex-col bg-white"
        style={{ borderRight: '1px solid #e5e3dc' }}
      >
        {/* Brand */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid #e5e3dc' }}>
          <Link href="/admin">
            <p style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: '1.15rem', letterSpacing: '0.08em', color: '#C9A84C' }}>
              Galaxy CMS
            </p>
          </Link>
          <p style={{ fontSize: '10px', color: '#9a978f', marginTop: '2px' }}>Admin Panel</p>
        </div>

        {/* Navigation */}
        <AdminNav />

        {/* Sign out */}
        <div style={{ borderTop: '1px solid #e5e3dc', padding: '12px 16px' }}>
          <form action={logout}>
            <button
              type="submit"
              className="w-full py-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors hover:text-amber-700"
              style={{ color: '#9a978f' }}
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex h-14 flex-shrink-0 items-center bg-white px-8"
          style={{ borderBottom: '1px solid #e5e3dc' }}
        >
          <Breadcrumb />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
