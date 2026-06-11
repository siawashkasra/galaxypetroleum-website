import { requireAuth } from '@/lib/session'
import { getCeoMessage } from '@/lib/db'
import { saveCeoMessage } from '@/app/actions/admin'
import AdminForm from '@/components/admin/AdminForm'
import ImageField from '@/components/admin/ImageField'

export default async function CeoMessagePage() {
  await requireAuth()
  const data = getCeoMessage()

  return (
    <div className="max-w-2xl">
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>CEO Message</h1>
      <p style={{ fontSize: '13px', color: '#9a978f', marginBottom: '32px' }}>
        The cinematic quote section displayed on the homepage.
      </p>

      <div className="rounded-sm bg-white p-8" style={{ border: '1px solid #e5e3dc' }}>
        <AdminForm action={saveCeoMessage}>
          <div className="flex flex-col gap-5">
            <Row>
              <Field label="Name" name="name" defaultValue={data.name} />
              <Field label="Title / Role" name="title" defaultValue={data.title} />
            </Row>
            <ImageField name="photo" label="CEO Photo" defaultValue={data.photo} />
            <Field label="Message" name="message" defaultValue={data.message} textarea rows={10} />
          </div>
        </AdminForm>
      </div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>
}

function Field({
  label, name, defaultValue = '', textarea = false, rows = 3,
}: {
  label: string; name: string; defaultValue?: string; textarea?: boolean; rows?: number
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
          id={name} name={name} type="text" defaultValue={defaultValue}
          className="border px-4 py-3 text-[13px] outline-none transition-colors"
          style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }}
        />
      )}
    </div>
  )
}
