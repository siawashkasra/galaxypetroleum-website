import { requireAuth } from '@/lib/session'
import { getServices } from '@/lib/db'
import { saveServices } from '@/app/actions/admin'
import AdminForm from '@/components/admin/AdminForm'

export default async function ServicesPage() {
  await requireAuth()
  const services = getServices()

  return (
    <div className="max-w-2xl">
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>Services</h1>
      <p style={{ fontSize: '13px', color: '#9a978f', marginBottom: '32px' }}>
        Edit service titles and descriptions. Icons are fixed.
      </p>

      <div className="rounded-sm bg-white p-8" style={{ border: '1px solid #e5e3dc' }}>
        <AdminForm action={saveServices}>
          <div className="space-y-5">
            {services.map(service => (
              <div key={service.id} className="rounded-sm p-5" style={{ background: '#faf9f7', border: '1px solid #ede9e0' }}>
                <input type="hidden" name="id" value={service.id} />
                <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9a978f', marginBottom: '14px' }}>
                  Icon: {service.icon}
                </p>
                <div className="space-y-4">
                  <Field label="Title" name="title" defaultValue={service.title} />
                  <Field label="Description" name="description" defaultValue={service.description} textarea rows={3} />
                </div>
              </div>
            ))}
          </div>
        </AdminForm>
      </div>
    </div>
  )
}

function Field({ label, name, defaultValue = '', textarea = false, rows = 3 }: {
  label: string; name: string; defaultValue?: string; textarea?: boolean; rows?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a776f' }}>{label}</label>
      {textarea ? (
        <textarea name={name} rows={rows} defaultValue={defaultValue} className="border px-4 py-3 text-[13px] outline-none resize-none" style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }} />
      ) : (
        <input name={name} defaultValue={defaultValue} className="border px-4 py-3 text-[13px] outline-none" style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }} />
      )}
    </div>
  )
}
