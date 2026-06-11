import { requireAuth } from '@/lib/session'
import { getTestimonials } from '@/lib/db'
import { saveTestimonial, removeTestimonial } from '@/app/actions/admin'
import AdminForm from '@/components/admin/AdminForm'

export default async function TestimonialsPage() {
  await requireAuth()
  const testimonials = getTestimonials()

  return (
    <div className="max-w-2xl">
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>Testimonials</h1>
      <p style={{ fontSize: '13px', color: '#9a978f', marginBottom: '32px' }}>
        Client quotes displayed on the homepage.
      </p>

      <div className="space-y-5">
        {testimonials.map(t => (
          <div key={t.id} className="rounded-sm bg-white p-6" style={{ border: '1px solid #e5e3dc' }}>
            <AdminForm action={saveTestimonial} submitLabel="Save" extra={<DeleteBtn id={t.id} />}>
              <input type="hidden" name="id" value={t.id} />
              <Field label="Quote" name="quote" defaultValue={t.quote} textarea rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Author" name="author" defaultValue={t.author} />
                <Field label="Role" name="role" defaultValue={t.role} />
              </div>
              <Field label="Company" name="company" defaultValue={t.company} />
            </AdminForm>
          </div>
        ))}

        {/* Add new */}
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a978f', marginBottom: '14px' }}>
            Add New
          </p>
          <div className="rounded-sm bg-white p-6" style={{ border: '1px solid #C9A84C', borderStyle: 'dashed' }}>
            <AdminForm action={saveTestimonial} submitLabel="Add Testimonial">
              <Field label="Quote" name="quote" defaultValue="" textarea rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Author" name="author" defaultValue="" />
                <Field label="Role" name="role" defaultValue="" />
              </div>
              <Field label="Company" name="company" defaultValue="" />
            </AdminForm>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeleteBtn({ id }: { id: string }) {
  return (
    <form action={removeTestimonial.bind(null, id)}>
      <button
        type="submit"
        className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] border transition-colors hover:bg-red-50"
        style={{ borderColor: '#fca5a5', color: '#dc2626', borderRadius: '2px' }}
      >
        Delete
      </button>
    </form>
  )
}

function Field({ label, name, defaultValue = '', textarea = false, rows = 3 }: {
  label: string; name: string; defaultValue?: string; textarea?: boolean; rows?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a776f' }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name} rows={rows} defaultValue={defaultValue}
          className="border px-4 py-3 text-[13px] outline-none resize-none"
          style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }}
        />
      ) : (
        <input
          name={name} defaultValue={defaultValue}
          className="border px-4 py-3 text-[13px] outline-none"
          style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }}
        />
      )}
    </div>
  )
}
