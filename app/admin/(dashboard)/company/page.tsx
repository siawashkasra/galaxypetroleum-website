import { requireAuth } from '@/lib/session'
import { getCompany } from '@/lib/db'
import { saveCompany } from '@/app/actions/admin'
import AdminForm from '@/components/admin/AdminForm'

export default async function CompanyPage() {
  await requireAuth()
  const c = getCompany()

  return (
    <div className="max-w-2xl">
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>Company Info</h1>
      <p style={{ fontSize: '13px', color: '#9a978f', marginBottom: '32px' }}>
        Contact details and homepage copy.
      </p>

      <div className="rounded-sm bg-white p-8" style={{ border: '1px solid #e5e3dc' }}>
        <AdminForm action={saveCompany}>
          <Field label="Tagline" name="tagline" defaultValue={c.tagline} />
          <Field label="About" name="about" defaultValue={c.about} textarea rows={5} />
          <Row>
            <Field label="Founded" name="founded" defaultValue={c.founded} />
            <Field label="Headquarters" name="headquarters" defaultValue={c.headquarters} />
          </Row>
          <Row>
            <Field label="Phone" name="phone" defaultValue={c.phone} />
            <Field label="WhatsApp" name="whatsapp" defaultValue={c.whatsapp} />
          </Row>
          <Row>
            <Field label="Email" name="email" type="email" defaultValue={c.email} />
            <Field label="Address" name="address" defaultValue={c.address} />
          </Row>
        </AdminForm>
      </div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>
}

function Field({
  label, name, defaultValue = '', textarea = false, rows = 3, type = 'text',
}: {
  label: string; name: string; defaultValue?: string; textarea?: boolean; rows?: number; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a776f' }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name} name={name} rows={rows} defaultValue={defaultValue}
          className="border px-4 py-3 text-[13px] outline-none resize-none transition-colors"
          style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }}
        />
      ) : (
        <input
          id={name} name={name} type={type} defaultValue={defaultValue}
          className="border px-4 py-3 text-[13px] outline-none transition-colors"
          style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }}
        />
      )}
    </div>
  )
}
