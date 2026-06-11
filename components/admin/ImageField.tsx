'use client'

import { useState, useRef } from 'react'
import { Upload, Link as LinkIcon } from 'lucide-react'

interface Props {
  name: string
  defaultValue?: string
  label?: string
}

export default function ImageField({ name, defaultValue = '', label = 'Image' }: Props) {
  const [url, setUrl]           = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const fileRef                 = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      if (res.ok) {
        const data = await res.json() as { url: string }
        setUrl(data.url)
      } else {
        setError('Upload failed — try again.')
      }
    } catch {
      setError('Network error.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a776f' }}>
        {label}
      </label>

      {/* Preview */}
      {url && (
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{ height: '120px', borderRadius: '2px', border: '1px solid #e5e3dc', background: '#f5f4f0' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Preview"
            style={{ maxHeight: '120px', maxWidth: '100%', width: 'auto', height: 'auto', display: 'block' }}
            onError={() => {/* let it show broken */}}
          />
        </div>
      )}

      {!url && (
        <div
          className="flex items-center justify-center"
          style={{ height: '80px', border: '1px dashed #d4d1ca', borderRadius: '2px', background: '#faf9f7', color: '#c4c1b9', fontSize: '12px' }}
        >
          No image selected
        </div>
      )}

      {/* URL input */}
      <div className="flex items-center gap-2">
        <LinkIcon size={14} style={{ color: '#9a978f', flexShrink: 0 }} />
        <input
          name={name}
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Image URL"
          className="flex-1 border px-3 py-2.5 text-[13px] outline-none transition-colors"
          style={{ borderColor: '#d4d1ca', background: '#fff', color: '#1a1906', borderRadius: '2px' }}
        />
      </div>

      {/* Upload button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors disabled:opacity-50"
          style={{ borderColor: '#d4d1ca', color: '#5a5750', background: '#faf9f7', borderRadius: '2px' }}
        >
          <Upload size={13} />
          {uploading ? 'Uploading…' : 'Upload Image'}
        </button>
        {error && <span style={{ fontSize: '11px', color: '#dc2626' }}>{error}</span>}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  )
}
