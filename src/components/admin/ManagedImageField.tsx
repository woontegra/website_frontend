import { useRef, useState } from 'react'
import { Upload, Link2, Loader2, CheckCircle2, AlertCircle, FolderOpen, X } from 'lucide-react'
import { adminUploadMedia, resolveMediaSrc } from '../../api/cms'
import { MediaLibraryModal } from './MediaLibraryModal'

const ACCEPT = '.jpg,.jpeg,.png,.webp,.svg'
const MAX_BYTES = 8 * 1024 * 1024

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
])

function validateImageFile(file: File): string | null {
  const extOk = /\.(jpe?g|png|webp|svg)$/i.test(file.name)
  if (!ALLOWED_TYPES.has(file.type) && !extOk) {
    return 'Sadece JPG, JPEG, PNG, WebP ve SVG dosyaları kabul edilir.'
  }
  if (file.size > MAX_BYTES) {
    return 'Dosya boyutu en fazla 8 MB olabilir.'
  }
  return null
}

type ManagedImageFieldProps = {
  label?: string
  value: string
  onChange: (url: string) => void
  hint?: string
  compact?: boolean
  inputClassName?: string
}

export function ManagedImageField({
  label,
  value,
  onChange,
  hint,
  compact = false,
  inputClassName,
}: ManagedImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showUrl, setShowUrl] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)

  const labelClass = compact ? 'label-sm' : 'label'
  const inputClass = inputClassName ?? (compact ? 'input-sm w-full' : 'input w-full')
  const previewSrc = value ? resolveMediaSrc(value) : ''

  const handleFile = async (file: File) => {
    const validationError = validateImageFile(file)
    if (validationError) {
      setStatus({ type: 'error', text: validationError })
      return
    }

    setUploading(true)
    setStatus(null)

    const result = await adminUploadMedia(file)
    setUploading(false)

    if (result.success && result.data?.url) {
      onChange(result.data.url)
      setStatus({ type: 'success', text: 'Görsel yüklendi ve kaydedildi.' })
      setTimeout(() => setStatus(null), 3000)
    } else {
      setStatus({ type: 'error', text: result.message ?? 'Yükleme başarısız.' })
    }
  }

  return (
    <div className="space-y-2">
      {label ? <label className={labelClass}>{label}</label> : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? 'Yükleniyor…' : 'Görsel Yükle'}
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => setLibraryOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          Medya Kütüphanesi
        </button>
        <button
          type="button"
          onClick={() => setShowUrl((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <Link2 className="h-3.5 w-3.5" />
          {showUrl ? 'URL Gizle' : 'URL Gir'}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" />
            Kaldır
          </button>
        ) : null}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) await handleFile(file)
        }}
      />

      {status ? (
        <p
          className={`flex items-center gap-1.5 text-xs font-medium ${
            status.type === 'success' ? 'text-emerald-700' : 'text-red-600'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          )}
          {status.text}
        </p>
      ) : null}

      {previewSrc ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
          <img
            src={previewSrc}
            alt="Önizleme"
            className="mx-auto max-h-36 w-auto max-w-full rounded object-contain"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>
      ) : null}

      {showUrl ? (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://… veya kalıcı medya URL’si"
          className={inputClass}
        />
      ) : null}

      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}

      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onPick={(url) => {
          onChange(url)
          setLibraryOpen(false)
          setStatus({ type: 'success', text: 'Görsel seçildi.' })
          setTimeout(() => setStatus(null), 3000)
        }}
      />
    </div>
  )
}
