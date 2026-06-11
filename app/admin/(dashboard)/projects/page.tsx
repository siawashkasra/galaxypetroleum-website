import { requireAuth } from '@/lib/session'
import { getProjects } from '@/lib/db'
import { saveProject, removeProject } from '@/app/actions/admin'
import AdminForm from '@/components/admin/AdminForm'
import ImageField from '@/components/admin/ImageField'

export default async function ProjectsPage() {
  await requireAuth()
  const projects = getProjects()

  return (
    <div className="max-w-2xl">
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1a1906', marginBottom: '6px' }}>Projects</h1>
      <p style={{ fontSize: '13px', color: '#9a978f', marginBottom: '32px' }}>
        Featured projects displayed on the homepage.
      </p>

      <div className="space-y-5">
        {projects.map(project => (
          <div key={project.id} className="rounded-sm bg-white p-6" style={{ border: '1px solid #e5e3dc' }}>
            <AdminForm action={saveProject} submitLabel="Save" extra={<DeleteBtn id={project.id} />}>
              <input type="hidden" name="id" value={project.id} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title" name="title" defaultValue={project.title} />
                <Field label="Category" name="category" defaultValue={project.category} />
              </div>
              <Field label="Description" name="description" defaultValue={project.description} textarea rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Year" name="year" defaultValue={project.year} />
              </div>
              <ImageField name="image" label="Project Photo" defaultValue={project.image} />
            </AdminForm>
          </div>
        ))}

        {/* Add new */}
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a978f', marginBottom: '14px' }}>
            Add New Project
          </p>
          <div className="rounded-sm bg-white p-6" style={{ border: '1px solid #C9A84C', borderStyle: 'dashed' }}>
            <AdminForm action={saveProject} submitLabel="Add Project">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title" name="title" defaultValue="" />
                <Field label="Category" name="category" defaultValue="" />
              </div>
              <Field label="Description" name="description" defaultValue="" textarea rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Year" name="year" defaultValue={String(new Date().getFullYear())} />
              </div>
              <ImageField name="image" label="Project Photo" defaultValue="" />
            </AdminForm>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeleteBtn({ id }: { id: string }) {
  return (
    <form action={removeProject.bind(null, id)}>
      <button type="submit" className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] border transition-colors hover:bg-red-50" style={{ borderColor: '#fca5a5', color: '#dc2626', borderRadius: '2px' }}>
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
      <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a776f' }}>{label}</label>
      {textarea ? (
        <textarea name={name} rows={rows} defaultValue={defaultValue} className="border px-4 py-3 text-[13px] outline-none resize-none" style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }} />
      ) : (
        <input name={name} defaultValue={defaultValue} className="border px-4 py-3 text-[13px] outline-none" style={{ borderColor: '#d4d1ca', color: '#1a1906', borderRadius: '2px' }} />
      )}
    </div>
  )
}
