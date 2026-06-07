import { useEffect, useRef, useState } from 'react'
import { Upload, Link2, Loader2, CheckCircle2, AlertCircle, FolderOpen, X } from 'lucide-react'
import { adminUploadMedia, resolveMediaSrc } from '../../api/cms'
import { isPersistentImageUrl } from '../../lib/resolveImageUrl'
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
  const [showManualUrl, setShowManualUrl] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [previewError, setPreviewError] = useState(false)

  const labelClass = compact ? 'label-sm' : 'label'
  const inputClass = inputClassName ?? (compact ? 'input-sm w-full' : 'input w-full')
  const previewSrc = value ? resolveMediaSrc(value) : ''

  useEffect(() => {
    setPreviewError(false)
  }, [previewSrc])

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
      setStatus({ type: 'success', text: 'Görsel yüklendi. Kalıcı URL alana yazıldı.' })
      setTimeout(() => setStatus(null), 4000)
    } else {
      setStatus({ type: 'error', text: result.message ?? 'Yükleme başarısız.' })
    }
  }

  const showLegacyWarning =
    Boolean(value) && !isPersistentImageUrl(value) && value.startsWith('/images/')

  return (
    <div className="space-y-2">
      {label ? <label className={labelClass}>{label}</label> : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? 'Yükleniyor…' : 'Dosya Seç / Görsel Yükle'}
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
          onClick={() => setShowManualUrl((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <Link2 className="h-3.5 w-3.5" />
          {showManualUrl ? 'Manuel URL Gizle' : 'Manuel URL'}
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

      {showLegacyWarning ? (
        <p className="text-xs font-medium text-amber-700">
          Bu yol ({value}) deploy sonrası kaybolabilir. Kalıcı olması için görseli yukarıdan yeniden yükleyin
          (Cloudinary URL önerilir).
        </p>
      ) : null}

      {value ? (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-slate-600">Kayıtlı görsel URL</p>
          <input
            type="text"
            readOnly
            value={value}
            className={`${inputClass} bg-slate-50 text-slate-700`}
          />
        </div>
      ) : null}

      {previewSrc ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
          {!previewError ? (
            <img
              src={previewSrc}
              alt="Önizleme"
              className="mx-auto max-h-40 w-auto max-w-full rounded object-contain"
              onError={() => setPreviewError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 py-6 text-center text-sm text-red-600">
              <AlertCircle className="h-6 w-6" />
              <span>Görsel önizlemesi yüklenemedi. URL geçersiz veya dosya sunucuda yok.</span>
            </div>
          )}
        </div>
      ) : null}

      {showManualUrl ? (
        <div className="space-y-1">
          <p className="text-xs text-slate-500">Gelişmiş: harici veya mevcut URL yapıştırın</p>
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://res.cloudinary.com/…"
            className={inputClass}
          />
        </div>
      ) : null}

      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}

      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onPick={(url) => {
          onChange(url)
          setLibraryOpen(false)
          setStatus({ type: 'success', text: 'Görsel medya kütüphanesinden seçildi.' })
          setTimeout(() => setStatus(null), 3000)
        }}
      />
    </div>
  )
}
