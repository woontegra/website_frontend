import { useEffect, useMemo, useState } from 'react'
import { Check, ImageIcon, Search, X } from 'lucide-react'
import { resolveImageUrl } from '../../lib/resolveImageUrl'
import {
  filterPublicImages,
  getFilenameFromPath,
  PUBLIC_IMAGE_CATALOG,
  PUBLIC_IMAGE_CATEGORIES,
  PUBLIC_IMAGE_CATEGORY_LABELS,
  type PublicImageCategoryFilter,
  type PublicImageItem,
} from '../../data/publicImageCatalog'

type PublicImagePickerModalProps = {
  open: boolean
  currentPath?: string
  onClose: () => void
  onConfirm: (path: string) => void
}

function ImageCard({
  item,
  selected,
  onSelect,
}: {
  item: PublicImageItem
  selected: boolean
  onSelect: () => void
}) {
  const src = resolveImageUrl(item.path)
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [src])

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
        selected
          ? 'border-green-500 ring-2 ring-green-500 ring-offset-2'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {!error ? (
          <img
            src={src}
            alt={item.alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Önizleme yok</span>
          </div>
        )}
        {selected ? (
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white shadow">
            <Check className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <div className="space-y-0.5 p-3">
        <p className="text-sm font-medium text-slate-900">{item.title}</p>
        <p className="font-mono text-[10px] text-slate-400">{getFilenameFromPath(item.path)}</p>
      </div>
    </button>
  )
}

export function PublicImagePickerModal({
  open,
  currentPath = '',
  onClose,
  onConfirm,
}: PublicImagePickerModalProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<PublicImageCategoryFilter>('all')
  const [pendingPath, setPendingPath] = useState(currentPath)

  useEffect(() => {
    if (open) {
      setPendingPath(currentPath)
      setSearch('')
      setCategory('all')
    }
  }, [open, currentPath])

  const filtered = useMemo(
    () => filterPublicImages(PUBLIC_IMAGE_CATALOG, search, category),
    [search, category],
  )

  const pendingItem = useMemo(
    () => PUBLIC_IMAGE_CATALOG.find((item) => item.path === pendingPath),
    [pendingPath],
  )

  const pendingSrc = pendingPath ? resolveImageUrl(pendingPath) : ''

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="public-image-picker-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="public-image-picker-title" className="text-base font-semibold text-slate-900">
              Görsel Galerisi
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              public/images klasöründeki görseller — ön izleme ile seçin
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 border-b border-slate-100 px-5 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Görsel ara…"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {PUBLIC_IMAGE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {PUBLIC_IMAGE_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">
              Arama veya filtreye uygun görsel bulunamadı.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item) => (
                <ImageCard
                  key={item.path}
                  item={item}
                  selected={pendingPath === item.path}
                  onSelect={() => setPendingPath(item.path)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              {pendingSrc ? (
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img
                    src={pendingSrc}
                    alt={pendingItem?.alt ?? 'Seçili görsel'}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {pendingItem?.title ?? (pendingPath ? 'Özel görsel' : 'Görsel seçilmedi')}
                </p>
                {pendingPath ? (
                  <p className="truncate font-mono text-xs text-slate-500">{pendingPath}</p>
                ) : (
                  <p className="text-xs text-slate-500">Galeriden bir görsel seçin</p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                İptal
              </button>
              <button
                type="button"
                disabled={!pendingPath}
                onClick={() => {
                  if (pendingPath) {
                    onConfirm(pendingPath)
                    onClose()
                  }
                }}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Seç
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
