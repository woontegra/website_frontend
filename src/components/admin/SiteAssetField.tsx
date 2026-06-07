import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ImageIcon, ImagePlus, Upload, X } from 'lucide-react'
import { uploadSiteAsset } from '../../api/siteAssets'
import { resolveImageUrl } from '../../lib/resolveImageUrl'
import { getFilenameFromPath } from '../../data/publicImageCatalog'
import { PublicImagePickerModal } from './PublicImagePickerModal'

type SiteAssetFieldProps = {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
  kind?: 'logo' | 'favicon'
}

export function SiteAssetField({
  label,
  value,
  onChange,
  hint,
  kind = 'logo',
}: SiteAssetFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const [manualDraft, setManualDraft] = useState(value)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const previewSrc = value ? resolveImageUrl(value) : ''
  const isFavicon = kind === 'favicon'

  useEffect(() => {
    setPreviewError(false)
  }, [previewSrc])

  useEffect(() => {
    setManualDraft(value)
  }, [value])

  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const result = await uploadSiteAsset(file, kind)
      onChange(result.path)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Dosya yüklenemedi')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="label mb-0">{label}</label>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50 ${
            isFavicon ? 'h-12 w-12' : 'h-14 w-28'
          }`}
        >
          {value && previewSrc && !previewError ? (
            <img
              src={previewSrc}
              alt={label}
              className={`max-h-full max-w-full ${isFavicon ? 'h-10 w-10 object-contain' : 'h-12 w-full object-contain px-1'}`}
              onError={() => setPreviewError(true)}
            />
          ) : (
            <ImageIcon className={`opacity-40 text-slate-400 ${isFavicon ? 'h-5 w-5' : 'h-6 w-6'}`} />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {value ? (
            <p className="truncate font-mono text-xs text-slate-600" title={value}>
              {value}
            </p>
          ) : (
            <p className="text-xs text-slate-400">Henüz seçilmedi</p>
          )}

          {previewError && value ? (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Önizleme yüklenemedi
            </p>
          ) : null}

          {uploadError ? (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {uploadError}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? 'Yükleniyor…' : 'PC’den Yükle'}
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Galeriden Seç
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
                Kaldır
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleUpload(file)
        }}
      />

      <div className="flex gap-2">
        <input
          type="text"
          value={manualDraft}
          onChange={(e) => setManualDraft(e.target.value)}
          placeholder={isFavicon ? '/favicon.png' : '/logo.png'}
          className="input-sm min-w-0 flex-1 font-mono text-xs"
        />
        <button
          type="button"
          disabled={!manualDraft.trim()}
          onClick={() => onChange(manualDraft.trim())}
          className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Uygula
        </button>
      </div>

      {value && !previewSrc ? (
        <p className="text-xs text-slate-400">Dosya: {getFilenameFromPath(value)}</p>
      ) : null}

      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}

      <PublicImagePickerModal
        open={pickerOpen}
        currentPath={value}
        onClose={() => setPickerOpen(false)}
        onConfirm={onChange}
      />
    </div>
  )
}
