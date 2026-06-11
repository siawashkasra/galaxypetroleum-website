'use client'

import { useActionState } from 'react'

type ActionResult = { ok?: boolean; error?: string } | null

interface Props {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>
  children: React.ReactNode
  submitLabel?: string
  /** Rendered beside the submit button — use for delete buttons on CRUD cards */
  extra?: React.ReactNode
}

export default function AdminForm({ action, children, submitLabel = 'Save Changes', extra }: Props) {
  const [state, dispatch, pending] = useActionState(action, null)

  return (
    <form action={dispatch} className="flex flex-col gap-5">
      {children}

      <div className="flex items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity disabled:opacity-50 hover:opacity-80"
          style={{ background: '#C9A84C', color: '#1a1906', borderRadius: '2px' }}
        >
          {pending ? 'Saving…' : submitLabel}
        </button>

        {extra}

        {state?.ok && (
          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>Saved</span>
        )}
        {state?.error && (
          <span style={{ fontSize: '12px', color: '#dc2626' }}>{state.error}</span>
        )}
      </div>
    </form>
  )
}
