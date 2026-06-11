'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/admin'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: '#f5f4f0' }}
    >
      <div
        className="w-full max-w-sm rounded-sm bg-white p-10"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px #e5e3dc' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-bebas-neue)',
            fontSize: '1.6rem',
            letterSpacing: '0.08em',
            color: '#C9A84C',
          }}
        >
          Galaxy CMS
        </p>
        <p style={{ fontSize: '12px', color: '#9a978f', marginTop: '4px', marginBottom: '32px' }}>
          Admin access only
        </p>

        <form action={action} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a776f' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="border px-4 py-3 text-[13px] outline-none transition-colors"
              style={{
                background: '#fff',
                borderColor: state?.error ? '#dc2626' : '#d4d1ca',
                color: '#1a1906',
                borderRadius: '2px',
              }}
            />
          </div>

          {state?.error && (
            <p style={{ fontSize: '12px', color: '#dc2626' }}>{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-opacity disabled:opacity-50 hover:opacity-80"
            style={{ background: '#C9A84C', color: '#1a1906', borderRadius: '2px' }}
          >
            {pending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
