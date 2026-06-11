import { requireAuth } from '@/lib/session'
import { getProducts } from '@/lib/db'
import { saveCommodity } from '@/app/actions/admin'
import AdminForm from '@/components/admin/AdminForm'
import ImageField from '@/components/admin/ImageField'

export default async function CommoditiesPage() {
  await requireAuth()
  const products = getProducts()

  return (
    <div className="max-w-2xl">
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>Commodities</h1>
      <p style={{ fontSize: '13px', color: '#9a978f', marginBottom: '32px' }}>
        Edit product content and images. The four products are fixed.
      </p>

      <div className="space-y-8">
        {products.map(product => (
          <div key={product.id} className="rounded-sm bg-white p-6" style={{ border: '1px solid #e5e3dc' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              {product.name}
            </p>
            <AdminForm action={saveCommodity}>
              <input type="hidden" name="id" value={product.id} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name" name="name" defaultValue={product.name} />
                <Field label="Grade" name="grade" defaultValue={product.grade} />
              </div>
              <Field label="Description" name="description" defaultValue={product.description} textarea rows={3} />
              <ImageField name="image" label="Product Image" defaultValue={product.image} />

              {/* Specs */}
              <div>
                <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a776f', marginBottom: '10px' }}>
                  Specs
                </p>
                <div className="space-y-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      <input
                        name="spec_label"
                        defaultValue={spec.label}
                        placeholder="Label"
                        className="border px-3 py-2 text-[12px] outline-none"
                        style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }}
                      />
                      <input
                        name="spec_value"
                        defaultValue={spec.value}
                        placeholder="Value"
                        className="border px-3 py-2 text-[12px] outline-none"
                        style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </AdminForm>
          </div>
        ))}
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
