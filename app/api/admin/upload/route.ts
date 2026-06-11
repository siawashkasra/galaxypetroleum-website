import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { verifySession } from '@/lib/session'

export async function POST(request: NextRequest) {
  const valid = await verifySession()
  if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file     = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  const MAX_MB = 5
  if (file.size > MAX_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Max file size is ${MAX_MB}MB` }, { status: 400 })
  }

  const ext       = path.extname(file.name).toLowerCase() || '.jpg'
  const filename  = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadsDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
