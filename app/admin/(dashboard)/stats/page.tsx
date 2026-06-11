import { requireAuth } from '@/lib/session'
import { getStats, getJourneyImpactStats } from '@/lib/db'
import { saveStats, saveJourneyStats } from '@/app/actions/admin'
import AdminForm from '@/components/admin/AdminForm'

export default async function StatsPage() {
  await requireAuth()
  const stats        = getStats()
  const journeyStats = getJourneyImpactStats()

  return (
    <div className="max-w-2xl space-y-10">
      {/* Homepage stats */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>Homepage Stats</h1>
        <p style={{ fontSize: '13px', color: '#9a978f', marginBottom: '32px' }}>
          The four animated counters in the Stats section.
        </p>

        <div className="rounded-sm bg-white p-8" style={{ border: '1px solid #e5e3dc' }}>
          <AdminForm action={saveStats}>
            <div className="space-y-3">
              {stats.map(stat => (
                <div
                  key={(stat as unknown as { id: number }).id}
                  className="grid grid-cols-[1fr_90px_120px] gap-3 items-end rounded-sm p-4"
                  style={{ background: '#faf9f7', border: '1px solid #ede9e0' }}
                >
                  <input type="hidden" name="id" value={String((stat as unknown as { id: number }).id)} />
                  <Inline label="Label" name="label" defaultValue={stat.label} />
                  <Inline label="Value" name="value" defaultValue={String(stat.value)} type="number" />
                  <Inline label="Suffix (e.g. +)" name="suffix" defaultValue={stat.suffix} />
                </div>
              ))}
            </div>
          </AdminForm>
        </div>
      </div>

      {/* Journey stats */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>Journey Impact Stats</h2>
        <p style={{ fontSize: '13px', color: '#9a978f', marginBottom: '32px' }}>
          The three numbers at the bottom of the Journey section.
        </p>

        <div className="rounded-sm bg-white p-8" style={{ border: '1px solid #e5e3dc' }}>
          <AdminForm action={saveJourneyStats}>
            <div className="space-y-3">
              {journeyStats.map(stat => (
                <div
                  key={(stat as unknown as { id: number }).id}
                  className="grid grid-cols-[1fr_90px_120px] gap-3 items-end rounded-sm p-4"
                  style={{ background: '#faf9f7', border: '1px solid #ede9e0' }}
                >
                  <input type="hidden" name="id" value={String((stat as unknown as { id: number }).id)} />
                  <Inline label="Label" name="label" defaultValue={stat.label} />
                  <Inline label="Value" name="value" defaultValue={String(stat.value)} type="number" />
                  <Inline label="Suffix" name="suffix" defaultValue={stat.suffix} />
                </div>
              ))}
            </div>
          </AdminForm>
        </div>
      </div>
    </div>
  )
}

function Inline({ label, name, defaultValue = '', type = 'text' }: {
  label: string; name: string; defaultValue?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a776f' }}>
        {label}
      </label>
      <input
        name={name} type={type} defaultValue={defaultValue}
        className="border px-3 py-2 text-[13px] outline-none"
        style={{ borderColor: '#d4d1ca', color: '#1a1906', background: '#fff', borderRadius: '2px' }}
      />
    </div>
  )
}
