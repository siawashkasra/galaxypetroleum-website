'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createSession, deleteSession, requireAuth } from '@/lib/session'
import {
  updateCompany,
  updateStat,
  upsertTestimonial,
  deleteTestimonial,
  upsertTeamMember,
  deleteTeamMember,
  upsertProject,
  deleteProject,
  updateService,
  updateProduct,
  updateJourneyImpactStat,
  updateCeoMessage,
  getProducts,
} from '@/lib/db'

/* ─── Auth ───────────────────────────────────────────────────── */

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const password = formData.get('password') as string
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Invalid password.' }
  }
  await createSession()
  redirect('/admin')
}

export async function logout() {
  await deleteSession()
  redirect('/admin/login')
}

/* ─── Company ────────────────────────────────────────────────── */

export async function saveCompany(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  await requireAuth()
  try {
    updateCompany({
      tagline:      (formData.get('tagline')      as string).trim(),
      founded:      (formData.get('founded')       as string).trim(),
      headquarters: (formData.get('headquarters')  as string).trim(),
      phone:        (formData.get('phone')         as string).trim(),
      whatsapp:     (formData.get('whatsapp')      as string).trim(),
      email:        (formData.get('email')         as string).trim(),
      address:      (formData.get('address')       as string).trim(),
      about:        (formData.get('about')         as string).trim(),
    })
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { error: 'Failed to save.' }
  }
}

/* ─── Stats ──────────────────────────────────────────────────── */

export async function saveStats(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  await requireAuth()
  try {
    const ids = (formData.getAll('id') as string[]).map(Number)
    const values  = formData.getAll('value')  as string[]
    const suffixes = formData.getAll('suffix') as string[]
    const labels  = formData.getAll('label')  as string[]

    ids.forEach((id, i) => {
      updateStat(id, {
        value:  parseInt(values[i], 10),
        suffix: suffixes[i].trim(),
        label:  labels[i].trim(),
      })
    })
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { error: 'Failed to save.' }
  }
}

/* ─── Testimonials ───────────────────────────────────────────── */

export async function saveTestimonial(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  await requireAuth()
  try {
    const id = ((formData.get('id') as string) || crypto.randomUUID()).trim()
    upsertTestimonial({
      id,
      quote:   (formData.get('quote')   as string).trim(),
      author:  (formData.get('author')  as string).trim(),
      role:    (formData.get('role')    as string).trim(),
      company: (formData.get('company') as string).trim(),
    })
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { error: 'Failed to save.' }
  }
}

export async function removeTestimonial(id: string) {
  await requireAuth()
  deleteTestimonial(id)
  revalidatePath('/', 'layout')
}

/* ─── Team ───────────────────────────────────────────────────── */

export async function saveTeamMember(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  await requireAuth()
  try {
    const id = ((formData.get('id') as string) || crypto.randomUUID()).trim()
    upsertTeamMember({
      id,
      name:     (formData.get('name')     as string).trim(),
      title:    (formData.get('title')    as string).trim(),
      image:    (formData.get('image')    as string).trim(),
      linkedin: (formData.get('linkedin') as string | null)?.trim() || undefined,
    })
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { error: 'Failed to save.' }
  }
}

export async function removeTeamMember(id: string) {
  await requireAuth()
  deleteTeamMember(id)
  revalidatePath('/', 'layout')
}

/* ─── Projects ───────────────────────────────────────────────── */

export async function saveProject(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  await requireAuth()
  try {
    const id = ((formData.get('id') as string) || crypto.randomUUID()).trim()
    upsertProject({
      id,
      title:       (formData.get('title')       as string).trim(),
      category:    (formData.get('category')    as string).trim(),
      description: (formData.get('description') as string).trim(),
      year:        (formData.get('year')        as string).trim(),
      image:       (formData.get('image')       as string).trim(),
    })
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { error: 'Failed to save.' }
  }
}

export async function removeProject(id: string) {
  await requireAuth()
  deleteProject(id)
  revalidatePath('/', 'layout')
}

/* ─── Services ───────────────────────────────────────────────── */

export async function saveServices(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  await requireAuth()
  try {
    const ids          = formData.getAll('id')          as string[]
    const titles       = formData.getAll('title')       as string[]
    const descriptions = formData.getAll('description') as string[]

    ids.forEach((id, i) => {
      updateService({ id, title: titles[i].trim(), description: descriptions[i].trim() })
    })
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { error: 'Failed to save.' }
  }
}

/* ─── Commodities ────────────────────────────────────────────── */

export async function saveCommodity(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  await requireAuth()
  try {
    const id   = (formData.get('id')   as string).trim()
    const name  = (formData.get('name')  as string).trim()
    const grade = (formData.get('grade') as string).trim()
    const description = (formData.get('description') as string).trim()
    const image = (formData.get('image') as string).trim()

    const specLabels = formData.getAll('spec_label') as string[]
    const specValues = formData.getAll('spec_value') as string[]
    const specs = specLabels
      .map((label, i) => ({ label: label.trim(), value: specValues[i].trim() }))
      .filter(s => s.label && s.value)

    const existing = getProducts().find(p => p.id === id)
    updateProduct({
      id,
      name,
      grade,
      description,
      image,
      specs,
      sort_order: (existing as unknown as { sort_order?: number })?.sort_order ?? 0,
    } as Parameters<typeof updateProduct>[0])

    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { error: 'Failed to save.' }
  }
}

/* ─── CEO Message ────────────────────────────────────────────── */

export async function saveCeoMessage(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  await requireAuth()
  try {
    updateCeoMessage({
      name:    (formData.get('name')    as string).trim(),
      title:   (formData.get('title')   as string).trim(),
      photo:   (formData.get('photo')   as string).trim(),
      message: (formData.get('message') as string).trim(),
    })
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { error: 'Failed to save.' }
  }
}

/* ─── Journey Impact Stats ───────────────────────────────────── */

export async function saveJourneyStats(_prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  await requireAuth()
  try {
    const ids     = (formData.getAll('id')     as string[]).map(Number)
    const values  = formData.getAll('value')   as string[]
    const suffixes = formData.getAll('suffix') as string[]
    const labels  = formData.getAll('label')   as string[]

    ids.forEach((id, i) => {
      updateJourneyImpactStat(id, {
        value:  parseInt(values[i], 10),
        suffix: suffixes[i].trim(),
        label:  labels[i].trim(),
      })
    })
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { error: 'Failed to save.' }
  }
}
