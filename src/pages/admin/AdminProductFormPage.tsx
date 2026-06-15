import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImageIcon, FolderOpen, Images, Trash2 } from 'lucide-react'
import { isAxiosError } from 'axios'
import { productsAdminApi, type AdminProductInput, type ProductType } from '../../api/products-admin'
import { productCategoriesAdminApi, type AdminProductCategory } from '../../api/product-categories-admin'
import type { CatalogMedia, CatalogMediaFileType } from '../../api/catalog-media-admin'
import { MediaPickerModal } from '../../components/admin/MediaPickerModal'
import { MediaThumb } from '../../components/ui/MediaThumb'
import { resolveAssetUrl } from '../../lib/resolveAssetUrl'

const TR_MAP: Record<string, string> = {
  ç: 'c',
  Ç: 'c',
  ğ: 'g',
  Ğ: 'g',
  ı: 'i',
  İ: 'i',
  ö: 'o',
  Ö: 'o',
  ş: 's',
  Ş: 's',
  ü: 'u',
  Ü: 'u',
}

function slugify(name: string): string {
  let s = name.trim().toLowerCase()
  for (const [k, v] of Object.entries(TR_MAP)) {
    s = s.split(k).join(v)
  }
  return s
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

const emptyForm: AdminProductInput = {
  name: '',
  slug: '',
  productType: 'DOWNLOAD',
  shortDescription: '',
  description: '',
  price: 0,
  compareAtPrice: null,
  currency: 'TRY',
  isActive: true,
  purchaseEnabled: true,
  licenseMonths: 12,
  featureBullets: '',
  isFeatured: false,
  sortOrder: 0,
  version: '',
  categoryId: null,
  seoTitle: '',
  seoDescription: '',
  coverImageMediaId: null,
  downloadMediaId: null,
  coverImage: '',
  downloadUrl: '',
}

type GalleryRow = { key: string; mediaId: string; preview: string }

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id

  const [form, setForm] = useState<AdminProductInput>(emptyForm)
  const [slugManual, setSlugManual] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<AdminProductCategory[]>([])
  const [coverPicker, setCoverPicker] = useState(false)
  const [filePicker, setFilePicker] = useState(false)
  const [advancedUrl, setAdvancedUrl] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [downloadInfo, setDownloadInfo] = useState<{ name: string; size: number } | null>(null)
  const [galleryRows, setGalleryRows] = useState<GalleryRow[]>([])
  const [galleryPicker, setGalleryPicker] = useState(false)

  const imageAllowed = useMemo((): CatalogMediaFileType[] => ['IMAGE'], [])
  const downloadAllowed = useMemo((): CatalogMediaFileType[] => ['DOWNLOAD', 'DOCUMENT'], [])

  useEffect(() => {
    void productCategoriesAdminApi.list().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (isNew) {
      setForm(emptyForm)
      setSlugManual(false)
      setLoading(false)
      setCoverPreview(null)
      setDownloadInfo(null)
      setGalleryRows([])
      return
    }
    let cancelled = false
    void (async () => {
      try {
        setLoading(true)
        const p = await productsAdminApi.getById(id!)
        if (cancelled) return
        setForm({
          name: p.name,
          slug: p.slug,
          productType: p.productType,
          shortDescription: p.shortDescription,
          description: p.description,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          currency: p.currency || 'TRY',
          isActive: p.isActive,
          purchaseEnabled: p.purchaseEnabled !== false,
          licenseMonths: typeof p.licenseMonths === 'number' && p.licenseMonths > 0 ? p.licenseMonths : 12,
          featureBullets: p.featureBullets ?? '',
          isFeatured: p.isFeatured,
          sortOrder: p.sortOrder,
          version: p.version ?? '',
          categoryId: p.categoryId,
          seoTitle: p.seoTitle ?? '',
          seoDescription: p.seoDescription ?? '',
          coverImageMediaId: p.coverImageMediaId,
          downloadMediaId: p.downloadMediaId,
          coverImage: p.coverImage ?? '',
          downloadUrl: p.downloadUrl ?? '',
        })
        setCoverPreview(p.coverMedia?.url ? resolveAssetUrl(p.coverMedia.url) : p.coverImage ? resolveAssetUrl(p.coverImage) : null)
        setDownloadInfo(
          p.downloadMedia
            ? { name: p.downloadMedia.originalName, size: p.downloadMedia.fileSize }
            : null,
        )
        setGalleryRows(
          (p.galleryImages ?? []).map((g) => ({
            key: g.id,
            mediaId: g.mediaId,
            preview: resolveAssetUrl(g.url),
          })),
        )
        setSlugManual(true)
        if (p.coverImage && !p.coverImageMediaId) setAdvancedUrl(true)
        if (p.downloadUrl && !p.downloadMediaId) setAdvancedUrl(true)
      } catch {
        if (!cancelled) setError('Ürün yüklenemedi.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isNew])

  useEffect(() => {
    if (slugManual || !isNew) return
    const auto = slugify(form.name)
    setForm((f) => ({ ...f, slug: auto }))
  }, [form.name, slugManual, isNew])

  const validate = (): string | null => {
    if (form.name.trim().length < 2) return 'Ürün adı en az 2 karakter olmalıdır.'
    const slugOut = (form.slug.trim() || slugify(form.name)).toLowerCase()
    if (!slugOut) return 'Slug üretilemedi; ürün adını kontrol edin.'
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugOut)) {
      return 'Slug yalnızca küçük harf, rakam ve tire içerebilir.'
    }
    if (!Number.isFinite(form.price) || form.price < 0) return 'Geçerli bir fiyat girin.'
    if (form.compareAtPrice != null && form.compareAtPrice !== 0) {
      if (!Number.isFinite(form.compareAtPrice) || form.compareAtPrice < form.price) {
        return 'Eski fiyat boş bırakılabilir; doluysa satış fiyatından küçük olamaz.'
      }
    }
    if (
      form.productType === 'DOWNLOAD' &&
      form.isActive &&
      form.purchaseEnabled &&
      !form.downloadMediaId &&
      !(form.downloadUrl ?? '').trim()
    ) {
      return 'Dijital ürünlerde indirme/teslimat bağlantısı zorunludur.'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setError(null)
    setSaving(true)
    try {
      const slugFinal = (form.slug.trim() || slugify(form.name)).toLowerCase()
      const payload: AdminProductInput = {
        ...form,
        name: form.name.trim(),
        slug: slugFinal,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        currency: form.currency.trim() || 'TRY',
        version: form.version.trim(),
        compareAtPrice: form.compareAtPrice === null || form.compareAtPrice === 0 ? null : form.compareAtPrice,
        categoryId: form.categoryId || null,
        seoTitle: form.seoTitle?.trim() || '',
        seoDescription: form.seoDescription?.trim() || '',
        coverImageMediaId: form.coverImageMediaId ?? null,
        downloadMediaId: form.downloadMediaId ?? null,
        galleryMediaIds: galleryRows.map((r) => r.mediaId),
      }
      if (advancedUrl) {
        payload.coverImage = (form.coverImage ?? '').trim()
      }
      const du = (form.downloadUrl ?? '').trim()
      if (du) {
        payload.downloadUrl = du
      }
      if (isNew) {
        await productsAdminApi.create(payload)
      } else {
        await productsAdminApi.update(id!, payload)
      }
      navigate('/admin/urunler')
    } catch (err) {
      const msg = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? err.message
        : 'Kayıt başarısız.'
      setError(typeof msg === 'string' ? msg : 'Kayıt başarısız.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex h-48 items-center justify-center text-slate-500">Yükleniyor…</div>
  }

  const section = (title: string, children: React.ReactNode) => (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 border-b border-slate-100 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  )

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link
          to="/admin/urunler"
          className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Ürün listesine dön
        </Link>
        <h1 className="page-title">{isNew ? 'Yeni ürün' : 'Ürün düzenle'}</h1>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {section(
          'A) Temel bilgiler',
          <>
            <div className="md:col-span-2">
              <label className="label" htmlFor="name">
                Ürün adı *
              </label>
              <input
                id="name"
                className="input w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                className="input w-full font-mono text-sm"
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true)
                  setForm({ ...form, slug: e.target.value })
                }}
              />
              <p className="mt-1 text-xs text-slate-500">Boş bırakılırsa addan otomatik üretilir (yeni üründe).</p>
            </div>
            <div>
              <label className="label" htmlFor="productType">
                Ürün tipi
              </label>
              <select
                id="productType"
                className="input w-full"
                value={form.productType}
                onChange={(e) => setForm({ ...form, productType: e.target.value as ProductType })}
              >
                <option value="DOWNLOAD">İndirilebilir (DOWNLOAD)</option>
                <option value="SAAS">SaaS / web lisans</option>
                <option value="SERVICE">Hizmet (SERVICE)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="shortDescription">
                Kısa açıklama
              </label>
              <input
                id="shortDescription"
                className="input w-full"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="description">
                Detay açıklama
              </label>
              <textarea
                id="description"
                className="textarea w-full"
                rows={6}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="featureBullets">
                Öne çıkan özellikler (her satır bir madde)
              </label>
              <textarea
                id="featureBullets"
                className="textarea w-full font-mono text-sm"
                rows={8}
                value={form.featureBullets}
                onChange={(e) => setForm({ ...form, featureBullets: e.target.value })}
                placeholder={'Örnek:\nWeb tabanlı kullanım\nÇok kullanıcılı büro yapısı'}
              />
            </div>
            <div>
              <label className="label" htmlFor="licenseMonths">
                Lisans süresi (ay)
              </label>
              <input
                id="licenseMonths"
                type="number"
                min={1}
                max={120}
                className="input w-full"
                value={form.licenseMonths}
                onChange={(e) =>
                  setForm({ ...form, licenseMonths: Number.parseInt(e.target.value, 10) || 12 })
                }
              />
              <p className="mt-1 text-xs text-slate-500">SaaS için tipik: 12 ay (yıllık).</p>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={form.purchaseEnabled}
                  onChange={(e) => setForm({ ...form, purchaseEnabled: e.target.checked })}
                  className="rounded border-slate-300"
                />
                Satın almaya açık
              </label>
              <p className="mt-1 text-xs text-slate-500">Kapalıysa ürün görünse bile sepete eklenemez.</p>
            </div>
          </>,
        )}

        {section(
          'B) Kategori ve yayın',
          <>
            <div className="md:col-span-2">
              <label className="label" htmlFor="categoryId">
                Kategori
              </label>
              <div className="relative">
                <FolderOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  id="categoryId"
                  className="input w-full pl-10"
                  value={form.categoryId ?? ''}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}
                >
                  <option value="">— Kategorisiz —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="sortOrder">
                Sıralama
              </label>
              <input
                id="sortOrder"
                type="number"
                className="input w-full"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number.parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-slate-300"
                />
                Aktif (yayında)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded border-slate-300"
                />
                Öne çıkan
              </label>
            </div>
          </>,
        )}

        {section(
          'C) Fiyatlandırma',
          <>
            <div>
              <label className="label" htmlFor="price">
                Fiyat *
              </label>
              <input
                id="price"
                type="number"
                min={0}
                step={0.01}
                className="input w-full"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="label" htmlFor="compareAtPrice">
                Karşılaştırma fiyatı
              </label>
              <input
                id="compareAtPrice"
                type="number"
                min={0}
                step={0.01}
                className="input w-full"
                value={form.compareAtPrice ?? ''}
                onChange={(e) => {
                  const raw = e.target.value
                  setForm({
                    ...form,
                    compareAtPrice: raw === '' ? null : Number.parseFloat(raw),
                  })
                }}
              />
            </div>
            <div>
              <label className="label" htmlFor="currency">
                Para birimi
              </label>
              <input id="currency" className="input w-full" value={form.currency} readOnly />
            </div>
            <div>
              <label className="label" htmlFor="version">
                Sürüm
              </label>
              <input
                id="version"
                className="input w-full"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="örn. 1.2.0"
              />
            </div>
          </>,
        )}

        {section(
          'D) Medya / dosyalar',
          <>
            <div className="md:col-span-2">
              <label className="label">Kapak görseli</label>
              <div className="flex flex-wrap items-start gap-4">
                {coverPreview && (
                  <MediaThumb url={coverPreview} fileType="IMAGE" className="h-24 w-36" alt="" />
                )}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setCoverPicker(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Medya kütüphanesinden seç (görsel)
                  </button>
                  {form.coverImageMediaId && (
                    <button
                      type="button"
                      className="text-left text-sm text-red-700 hover:underline"
                      onClick={() => {
                        setForm({ ...form, coverImageMediaId: null })
                        setCoverPreview(null)
                      }}
                    >
                      Seçimi kaldır
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="label">Galeri görselleri</label>
              <p className="mb-3 text-xs text-slate-500">
                Medya kütüphanesinden yalnızca görsel (IMAGE) dosyaları ekleyin. Sıra, seçim sırasına göre kaydedilir.
              </p>
              <div className="flex flex-wrap gap-3">
                {galleryRows.map((row) => (
                  <div key={row.key} className="relative">
                    <MediaThumb url={row.preview} fileType="IMAGE" className="h-20 w-28" alt="" />
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 rounded-full border border-slate-200 bg-white p-1 text-slate-600 shadow hover:bg-red-50 hover:text-red-700"
                      onClick={() => setGalleryRows((rows) => rows.filter((r) => r.key !== row.key))}
                      aria-label="Galeriden kaldır"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setGalleryPicker(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                <Images className="h-4 w-4" />
                Galeriye görsel ekle
              </button>
            </div>
            <div className="md:col-span-2">
              <label className="label">
                {form.productType === 'DOWNLOAD' ? 'İndirme / teslimat bağlantısı *' : 'Program / indirme dosyası'}
              </label>
              {form.productType === 'DOWNLOAD' && (
                <p className="mb-2 text-xs text-slate-500">
                  Ödeme onay mailinde müşteriye gönderilecek indirme bağlantısıdır. Medya kütüphanesinden dosya
                  seçebilir veya aşağıya tam bağlantı (https://…) yazabilirsiniz.
                </p>
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setFilePicker(true)}
                  className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                >
                  Medya kütüphanesinden seç (ZIP / EXE / PDF…)
                </button>
                {downloadInfo && (
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">{downloadInfo.name}</span> —{' '}
                    {(downloadInfo.size / 1024).toFixed(1)} KB
                  </p>
                )}
                {form.downloadMediaId && (
                  <button
                    type="button"
                    className="w-fit text-sm text-red-700 hover:underline"
                    onClick={() => {
                      setForm({ ...form, downloadMediaId: null })
                      setDownloadInfo(null)
                    }}
                  >
                    Seçimi kaldır
                  </button>
                )}
              </div>
              {form.productType === 'DOWNLOAD' && (
                <div className="mt-3">
                  <label className="label text-slate-700" htmlFor="downloadUrlDirect">
                    Doğrudan bağlantı (medya yoksa zorunlu)
                  </label>
                  <input
                    id="downloadUrlDirect"
                    className="input mt-1 w-full font-mono text-sm"
                    value={form.downloadUrl ?? ''}
                    onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                    placeholder="https://… veya /uploads/…"
                  />
                </div>
              )}
            </div>
          </>,
        )}

        {section(
          'E) SEO',
          <>
            <div className="md:col-span-2">
              <label className="label" htmlFor="seoTitle">
                SEO başlık
              </label>
              <input
                id="seoTitle"
                className="input w-full"
                value={form.seoTitle ?? ''}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="seoDescription">
                SEO açıklama
              </label>
              <textarea
                id="seoDescription"
                className="textarea w-full"
                rows={3}
                value={form.seoDescription ?? ''}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              />
            </div>
          </>,
        )}

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
          <button
            type="button"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
            onClick={() => setAdvancedUrl((v) => !v)}
          >
            {advancedUrl ? '▼' : '▶'} Gelişmiş: doğrudan URL (eski veri / özel durum)
          </button>
          {advancedUrl && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="label text-slate-600">Kapak görseli URL</label>
                <input
                  className="input w-full font-mono text-sm"
                  value={form.coverImage ?? ''}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="/uploads/... veya https://..."
                />
              </div>
              {form.productType !== 'DOWNLOAD' && (
                <div className="md:col-span-2">
                  <label className="label text-slate-600">İndirme URL</label>
                  <input
                    className="input w-full font-mono text-sm"
                    value={form.downloadUrl ?? ''}
                    onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                    placeholder="Yalnızca gerekirse"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
          <Link
            to="/admin/urunler"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            İptal
          </Link>
        </div>
      </form>

      <MediaPickerModal
        open={coverPicker}
        title="Kapak görseli seç"
        allowedTypes={[...imageAllowed]}
        onClose={() => setCoverPicker(false)}
        onSelect={(m: CatalogMedia) => {
          setForm((f) => ({ ...f, coverImageMediaId: m.id }))
          setCoverPreview(resolveAssetUrl(m.url))
        }}
      />
      <MediaPickerModal
        open={filePicker}
        title="İndirme dosyası seç"
        allowedTypes={[...downloadAllowed]}
        onClose={() => setFilePicker(false)}
        onSelect={(m: CatalogMedia) => {
          setForm((f) => ({ ...f, downloadMediaId: m.id }))
          setDownloadInfo({ name: m.originalName, size: m.fileSize })
        }}
      />
      <MediaPickerModal
        open={galleryPicker}
        title="Galeri görseli seç"
        allowedTypes={[...imageAllowed]}
        onClose={() => setGalleryPicker(false)}
        onSelect={(m: CatalogMedia) => {
          if (m.fileType !== 'IMAGE') return
          setGalleryRows((rows) => {
            if (rows.some((r) => r.mediaId === m.id)) return rows
            return [
              ...rows,
              {
                key: `new-${m.id}-${Date.now()}`,
                mediaId: m.id,
                preview: resolveAssetUrl(m.url),
              },
            ]
          })
        }}
      />
    </div>
  )
}
