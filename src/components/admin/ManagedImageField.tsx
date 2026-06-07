import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ChevronDown, ChevronUp, ImageIcon, ImagePlus, X } from 'lucide-react'
import { resolveImageUrl } from '../../lib/resolveImageUrl'
import { findPublicImageByPath, getFilenameFromPath } from '../../data/publicImageCatalog'
import { PublicImagePickerModal } from './PublicImagePickerModal'

const HELP_TEXT =
  'Görseller frontend/public/images klasörüne eklenmeli ve /images/dosya-adi.png formatında kullanılmalıdır. Canlı panelden yapılan /uploads yüklemeleri deploy sonrası kalıcı değildir.'

type ManagedImageFieldProps = {
  label?: string
  value: string
  onChange: (url: string) => void
  hint?: string
  compact?: boolean
  inputClassName?: string
}

/**
 * Kurumsal site görsel alanı — public/images galeri seçici.
 * Tüm panel görsel alanları bu component üzerinden çalışır.
 */
export function ManagedImageField({
  label,
  value,
  onChange,
  hint,
  compact = false,
  inputClassName,
}: ManagedImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [manualDraft, setManualDraft] = useState('')

  const labelClass = compact ? 'label-sm' : 'label'
  const inputClass = inputClassName ?? (compact ? 'input-sm w-full' : 'input w-full')
  const previewSrc = value ? resolveImageUrl(value) : ''
  const isUploadPath = value.startsWith('/uploads/')

  const catalogItem = useMemo(() => (value ? findPublicImageByPath(value) : undefined), [value])
  const displayTitle = catalogItem?.title ?? (value ? 'Özel görsel' : '')

  useEffect(() => {
    setPreviewError(false)
  }, [previewSrc])

  useEffect(() => {
    if (manualOpen) setManualDraft(value)
  }, [manualOpen, value])

  return (
    <div className="space-y-3">
      {label ? <label className={labelClass}>{label}</label> : null}

      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        {HELP_TEXT}
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {value && previewSrc && !previewError ? (
          <div className="aspect-[16/7] w-full overflow-hidden bg-slate-100">
            <img
              src={previewSrc}
              alt={catalogItem?.alt ?? displayTitle}
              className="h-full w-full object-cover"
              onError={() => setPreviewError(true)}
            />
          </div>
        ) : (
          <div className="flex aspect-[16/7] flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
            <ImageIcon className="h-10 w-10 opacity-50" />
            <span className="text-sm">Henüz görsel seçilmedi</span>
          </div>
        )}

        <div className="space-y-3 p-4">
          {value ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{displayTitle}</p>
              <p className="font-mono text-xs text-slate-500">{value}</p>
              {!catalogItem && value ? (
                <p className="text-xs text-slate-400">
                  Dosya: {getFilenameFromPath(value)}
                </p>
              ) : null}
            </div>
          ) : null}

          {previewError && value ? (
            <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Önizleme yüklenemedi. Path public/images içinde olmayabilir.
            </p>
          ) : null}

          {isUploadPath ? (
            <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              /uploads/ yolu deploy sonrası kaybolur. Galeriden /images/... seçin.
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <ImagePlus className="h-4 w-4" />
              Görsel Seç
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Kaldır
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200">
        <button
          type="button"
          onClick={() => setManualOpen((o) => !o)}
          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <span>Manuel URL (gelişmiş)</span>
          {manualOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {manualOpen ? (
          <div className="space-y-2 border-t border-slate-100 px-3 py-3">
            <input
              type="text"
              value={manualDraft}
              onChange={(e) => setManualDraft(e.target.value)}
              placeholder="/images/yazilim.png"
              className={inputClass}
            />
            <button
              type="button"
              disabled={!manualDraft.trim()}
              onClick={() => onChange(manualDraft.trim())}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              URL uygula
            </button>
          </div>
        ) : null}
      </div>

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
