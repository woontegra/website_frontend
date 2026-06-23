import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { isAxiosError } from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Check,
  CreditCard,
  Heart,
  ImageIcon,
  KeyRound,
  Mail,
  Monitor,
  ShieldCheck,
} from 'lucide-react'
import {
  productsPublicApi,
  type PublicProductDetail,
} from '../api/products-public'
import type { ProductType } from '../api/products-admin'
import { buildApiUrl } from '../config/api'
import { formatProductPrice, productPricePeriodSuffix } from '../lib/formatProductPrice'
import { formatMoneyAmount } from '../lib/formatMoney'
import { addToCart, clearCart, type CartSnapshot } from '../lib/cartStorage'
import { useSiteSettings } from '../contexts/SiteSettingsContext'
import { ProductImageGallery } from '../components/store/ProductImageGallery'
import { useCustomerFavorites } from '../hooks/useCustomerFavorites'

function formatComparePrice(p: PublicProductDetail) {
  if (p.compareAtPrice == null || p.compareAtPrice <= p.price) return null
  return formatMoneyAmount(p.compareAtPrice, p.currency)
}

function ProductBodyText({ text }: { text: string }) {
  const trimmed = text.trim()
  if (!trimmed) return null
  const blocks = trimmed.split(/\n\n+/)
  if (blocks.length <= 1) {
    return (
      <div className="max-w-none text-base leading-relaxed text-slate-700 lg:text-lg lg:leading-relaxed">
        <p className="whitespace-pre-wrap">{trimmed}</p>
      </div>
    )
  }
  return (
    <div className="max-w-none space-y-5 text-base leading-relaxed text-slate-700 lg:text-lg lg:leading-relaxed">
      {blocks.map((block, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {block.trim()}
        </p>
      ))}
    </div>
  )
}

const TYPE_LEAD_FALLBACK: Record<ProductType, string> = {
  DOWNLOAD:
    'Masaüstü kullanım için hazırlanmış yazılım ürünü. Satın alma sonrası lisans ve teslimat bilgileri iletilir.',
  SAAS:
    'Çoklu kullanıcı / abonelik yapısına uygun yazılım hizmeti. Satın alma veya başvuru sonrası hesap kurulumu yapılır.',
  SERVICE: 'Woontegra tarafından sunulan hizmet.',
}

function productTypeLabel(productType: ProductType): string {
  switch (productType) {
    case 'DOWNLOAD':
      return 'Masaüstü Program'
    case 'SAAS':
      return 'Çoklu Kullanıcı / SaaS'
    case 'SERVICE':
      return 'Hizmet'
    default:
      return 'Ürün'
  }
}

function licenseDisplayLabel(product: PublicProductDetail): string {
  if (product.licenseRequired) return 'Merkezi Lisans'
  const isFree = !Number.isFinite(product.price) || product.price <= 0
  if (isFree && product.purchaseEnabled === false) return 'Ücretsiz'
  if (product.productType === 'SAAS' || product.productType === 'SERVICE') return 'Manuel Teslim'
  return 'Lisanssız'
}

function hasValidPrice(product: PublicProductDetail): boolean {
  return Number.isFinite(product.price) && product.price > 0
}

function canPurchaseProduct(product: PublicProductDetail): boolean {
  if (product.purchaseEnabled === false) return false
  if (!hasValidPrice(product)) return false
  return (
    product.productType === 'DOWNLOAD' ||
    product.productType === 'SAAS' ||
    product.productType === 'SERVICE'
  )
}

function parseFeatureBullets(raw: string | undefined | null): string[] {
  return (raw ?? '')
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function productHasImageSources(product: PublicProductDetail): boolean {
  if (product.coverImage?.trim()) return true
  return (product.galleryImages?.length ?? 0) > 0
}

function cartSnapshotFromProduct(product: PublicProductDetail): CartSnapshot {
  return {
    name: product.name,
    slug: product.slug,
    price: product.price,
    currency: product.currency,
    productType: product.productType,
    coverImage: product.coverImage,
    licenseDurationMonths: product.licenseMonths,
  }
}

function PurchasePanel({
  product,
  supportEmail,
  canPurchase,
  isWebProduct,
  webUsageYears,
  onWebUsageYearsChange,
  onSepeteEkle,
  onSatınAlCheckout,
  onScrollToDetails,
  onScrollToGallery,
  hasGallery,
  favoriteButton,
}: {
  product: PublicProductDetail
  supportEmail: string
  canPurchase: boolean
  isWebProduct: boolean
  webUsageYears: number
  onWebUsageYearsChange: (years: number) => void
  onSepeteEkle: () => void
  onSatınAlCheckout: () => void
  onScrollToDetails: () => void
  onScrollToGallery: () => void
  hasGallery: boolean
  favoriteButton?: ReactNode
}) {
  const compare = formatComparePrice(product)
  const periodSuffix = productPricePeriodSuffix(product.productType)

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl ring-1 ring-slate-900/[0.06] sm:p-8 lg:min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 lg:text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" aria-hidden />
            Satın alma
          </div>
        </div>
        {favoriteButton ? <div className="shrink-0 pt-0.5">{favoriteButton}</div> : null}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="inline-flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0">
          <span className="text-3xl font-bold text-emerald-700 lg:text-4xl">{formatProductPrice(product)}</span>
          {periodSuffix ? (
            <span className="text-sm font-medium text-slate-500 lg:text-base">{periodSuffix}</span>
          ) : null}
        </span>
        {compare ? (
          <span className="text-lg text-slate-400 line-through lg:text-xl">{compare}</span>
        ) : null}
      </div>

      {product.licenseRequired ? (
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            Merkezi lisans — ödeme sonrası e-posta ile iletilir
          </li>
          {product.licenseDays != null && product.licenseDays > 0 ? (
            <li>Lisans süresi: {product.licenseDays} gün</li>
          ) : null}
          {product.licenseMaxDevices != null && product.licenseMaxDevices > 0 ? (
            <li>Cihaz hakkı: {product.licenseMaxDevices}</li>
          ) : null}
        </ul>
      ) : null}

      {product.productType === 'DOWNLOAD' && product.hasDownload ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          İndirme bağlantısı güvenlik nedeniyle public sayfada gösterilmez; ödeme onayı sonrası e-posta ile iletilir.
        </p>
      ) : null}

      {isWebProduct && canPurchase ? (
        <div className="mt-5 space-y-2">
          <label htmlFor="purchase-web-years" className="block text-sm font-medium text-slate-800">
            Kullanım süresi
          </label>
          <select
            id="purchase-web-years"
            value={webUsageYears}
            onChange={(e) => onWebUsageYearsChange(Number(e.target.value))}
            className="h-11 w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((y) => (
              <option key={y} value={y}>
                {y} yıl ({(product.licenseMonths ?? 12) * y} ay)
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {!canPurchase ? (
        <p className="mt-5 rounded-xl border border-amber-200/90 bg-amber-50 px-4 py-3 text-sm font-medium leading-relaxed text-amber-950">
          {product.purchaseEnabled === false
            ? 'Bu ürün şu anda satın almaya kapalıdır.'
            : !hasValidPrice(product)
              ? 'Bu ürün için fiyat tanımlı değil; satın alma kullanılamıyor.'
              : 'Bu ürün için satın alma şu an kullanılamıyor.'}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <button
          type="button"
          onClick={onSepeteEkle}
          disabled={!canPurchase}
          className="flex w-full flex-1 items-center justify-center rounded-xl bg-emerald-600 py-4 text-center text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:py-[1.125rem] sm:text-lg"
        >
          Sepete Ekle
        </button>
        <button
          type="button"
          onClick={onSatınAlCheckout}
          disabled={!canPurchase}
          className="flex w-full flex-1 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white py-4 text-center text-base font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:py-[1.125rem] sm:text-lg"
        >
          Satın Al
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onScrollToDetails}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Ürün detayları
        </button>
        {hasGallery ? (
          <button
            type="button"
            onClick={onScrollToGallery}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            <ImageIcon className="h-4 w-4" aria-hidden />
            Ekran görüntüleri
          </button>
        ) : null}
      </div>

      <p className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-xs leading-relaxed text-slate-600 lg:text-sm">
        <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 lg:h-5 lg:w-5" aria-hidden />
        Ödeme PayTR ile güvenli şekilde alınır. Teslimat bilgileri ödeme onayı sonrası e-posta ile gönderilir.
      </p>

      <p className="mt-3 flex items-start gap-3 text-xs leading-relaxed text-slate-500 lg:text-sm">
        <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>
          Destek:{' '}
          <a
            href={`mailto:${supportEmail}`}
            className="font-semibold text-accent-blue underline-offset-2 hover:underline"
          >
            {supportEmail}
          </a>
        </span>
      </p>
    </div>
  )
}

export function UrunDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { contactEmail } = useSiteSettings()
  const supportEmail = contactEmail?.trim() || 'info@woontegra.com'
  const { favoriteIds, favoriteBusyId, toggleFavorite } = useCustomerFavorites()

  const [product, setProduct] = useState<PublicProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [webUsageYears, setWebUsageYears] = useState(1)

  useEffect(() => {
    setWebUsageYears(1)
  }, [product?.id])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    let cancelled = false
    if (!slug?.trim()) {
      setLoading(false)
      setProduct(null)
      setError('Ürün bulunamadı.')
      return
    }
    const productSlug = slug.trim()
    const requestUrl = buildApiUrl(`/products/${encodeURIComponent(productSlug)}`)
    void (async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productsPublicApi.getBySlug(productSlug)
        if (!cancelled) setProduct(data)
      } catch (err) {
        if (!cancelled) {
          setProduct(null)
          setError('Ürün bulunamadı.')
          if (import.meta.env.DEV) {
            const status = isAxiosError(err) ? err.response?.status : undefined
            console.debug('[UrunDetailPage]', { productSlug, requestUrl, responseStatus: status })
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  const showToast = (msg?: string) => {
    setToast(msg ?? 'Bu ürün için satın alma şu an kullanılamıyor.')
  }

  const isWebProduct = product?.productType === 'SAAS' || product?.productType === 'SERVICE'
  const canPurchase = product ? canPurchaseProduct(product) : false
  const featureBullets = useMemo(
    () => (product ? parseFeatureBullets(product.featureBullets) : []),
    [product],
  )
  const hasGallerySources = product ? productHasImageSources(product) : false

  const scrollToProductDetails = () => {
    document.getElementById('product-desc-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToGallery = () => {
    document.getElementById('product-gallery-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSepeteEkle = () => {
    if (!product || !canPurchase) {
      showToast()
      return
    }
    const snapshot = cartSnapshotFromProduct(product)
    if (isWebProduct) {
      addToCart(product.id, webUsageYears, { snapshot, replaceLine: true })
    } else {
      addToCart(product.id, 1, { snapshot })
    }
    setToast('Ürün sepete eklendi.')
  }

  const handleSatınAlCheckout = () => {
    if (!product || !canPurchase) {
      showToast()
      return
    }
    const snapshot = cartSnapshotFromProduct(product)
    clearCart()
    if (isWebProduct) {
      addToCart(product.id, webUsageYears, { snapshot, replaceLine: true })
    } else {
      addToCart(product.id, 1, { snapshot })
    }
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-4 py-20 text-center text-slate-600 sm:px-6 lg:px-8">
        <div
          className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"
          aria-hidden
        />
        <p className="mt-4 text-sm font-medium">Ürün yükleniyor…</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-red-800">{error ?? 'Ürün bulunamadı.'}</p>
        <Link to="/urunler" className="mt-6 inline-block text-sm font-semibold text-accent-blue hover:underline">
          Ürünlere dön
        </Link>
      </div>
    )
  }

  const title = product.seoTitle?.trim() || product.name
  const lead =
    product.shortDescription?.trim() ||
    product.seoDescription?.trim() ||
    TYPE_LEAD_FALLBACK[product.productType]
  const descriptionText =
    product.description?.trim() || TYPE_LEAD_FALLBACK[product.productType]

  const typeLabel = productTypeLabel(product.productType)
  const licenseLabel = licenseDisplayLabel(product)

  const favBusy = favoriteBusyId === product.id
  const isFavorite = favoriteIds.has(product.id)
  const favoriteButton = (
    <button
      type="button"
      onClick={() => void toggleFavorite(product.id)}
      disabled={favBusy}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-600 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 disabled:opacity-50"
      aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} aria-hidden />
    </button>
  )

  const purchasePanelProps = {
    product,
    supportEmail,
    canPurchase,
    isWebProduct: !!isWebProduct,
    webUsageYears,
    onWebUsageYearsChange: setWebUsageYears,
    onSepeteEkle: handleSepeteEkle,
    onSatınAlCheckout: handleSatınAlCheckout,
    onScrollToDetails: scrollToProductDetails,
    onScrollToGallery: scrollToGallery,
    hasGallery: hasGallerySources,
    favoriteButton,
  }

  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50/80 pb-28 lg:pb-32">
      {/* Satış odaklı hero */}
      <section
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white"
        aria-labelledby="product-hero-title"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,rgba(34,197,94,0.2),transparent_58%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_65%,rgba(59,130,246,0.12),transparent_52%)]"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <nav className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-slate-400" aria-label="Sayfa konumu">
            <Link to="/urunler" className="font-semibold text-slate-300 transition hover:text-white">
              Ürünler
            </Link>
            <span className="text-slate-600">/</span>
            {product.category ? (
              <>
                <Link
                  to={`/kategori/${product.category.slug}`}
                  className="font-semibold text-emerald-300/95 transition hover:text-emerald-200"
                >
                  {product.category.name}
                </Link>
                <span className="text-slate-600">/</span>
              </>
            ) : null}
            <span className="font-medium text-slate-200">{product.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-100 backdrop-blur-sm lg:text-sm">
              {typeLabel}
            </span>
            <span className="inline-flex items-center rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-100 backdrop-blur-sm lg:text-sm">
              {licenseLabel}
            </span>
            {product.category ? (
              <Link
                to={`/kategori/${product.category.slug}`}
                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 lg:text-sm"
              >
                {product.category.name}
              </Link>
            ) : null}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-1 lg:items-start">
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-4">
                <h1
                  id="product-hero-title"
                  className="max-w-[min(100%,52rem)] text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.08]"
                >
                  {title}
                </h1>
                <div className="shrink-0 lg:hidden">{favoriteButton}</div>
              </div>

              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl lg:text-[1.25rem]">
                {lead}
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <span className="text-3xl font-bold text-emerald-400 sm:text-4xl">
                  {formatProductPrice(product)}
                </span>
                {productPricePeriodSuffix(product.productType) ? (
                  <span className="text-base font-medium text-slate-400">
                    {productPricePeriodSuffix(product.productType)}
                  </span>
                ) : null}
              </div>

              {product.licenseRequired ? (
                <ul className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                  <li className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <KeyRound className="h-4 w-4 text-emerald-400" aria-hidden />
                    Merkezi lisans
                  </li>
                  {product.licenseDays != null && product.licenseDays > 0 ? (
                    <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      {product.licenseDays} gün
                    </li>
                  ) : null}
                  {product.licenseMaxDevices != null && product.licenseMaxDevices > 0 ? (
                    <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      {product.licenseMaxDevices} cihaz
                    </li>
                  ) : null}
                </ul>
              ) : null}

              {product.productType === 'DOWNLOAD' && product.version?.trim() ? (
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400">
                  <Monitor className="h-4 w-4" aria-hidden />
                  Sürüm: {product.version.trim()}
                </p>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:hidden">
                <button
                  type="button"
                  onClick={handleSepeteEkle}
                  disabled={!canPurchase}
                  className="rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sepete Ekle
                </button>
                <button
                  type="button"
                  onClick={handleSatınAlCheckout}
                  disabled={!canPurchase}
                  className="rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Satın Al
                </button>
                <button
                  type="button"
                  onClick={scrollToProductDetails}
                  className="rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Detaylar
                </button>
                {hasGallerySources ? (
                  <button
                    type="button"
                    onClick={scrollToGallery}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    <ImageIcon className="h-4 w-4" aria-hidden />
                    Ekran görüntüleri
                  </button>
                ) : null}
              </div>

              {!canPurchase ? (
                <p className="mt-4 text-sm font-medium text-amber-200/95">
                  {product.purchaseEnabled === false
                    ? 'Bu ürün şu anda satın almaya kapalıdır.'
                    : !hasValidPrice(product)
                      ? 'Fiyat tanımlı değil; satın alma kullanılamıyor.'
                      : 'Satın alma şu an kullanılamıyor.'}
                </p>
              ) : null}

              <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
                <button
                  type="button"
                  onClick={handleSepeteEkle}
                  disabled={!canPurchase}
                  className="rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sepete Ekle
                </button>
                <button
                  type="button"
                  onClick={handleSatınAlCheckout}
                  disabled={!canPurchase}
                  className="rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Satın Al
                </button>
                <button
                  type="button"
                  onClick={scrollToProductDetails}
                  className="rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Detaylar
                </button>
                {hasGallerySources ? (
                  <button
                    type="button"
                    onClick={scrollToGallery}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    <ImageIcon className="h-4 w-4" aria-hidden />
                    Ekran görüntüleri
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1240px] px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(26rem,34%)] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_28rem] xl:gap-14">
          <div className="min-w-0 space-y-12 lg:space-y-16 xl:space-y-20">
            <div className="lg:hidden">
              <PurchasePanel {...purchasePanelProps} />
            </div>

            {hasGallerySources ? (
              <ProductImageGallery
                productName={product.name}
                coverImage={product.coverImage}
                galleryImages={product.galleryImages ?? []}
              />
            ) : null}

            <section aria-labelledby="product-desc-heading" className="scroll-mt-24">
              <h2 id="product-desc-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                Ürün hakkında
              </h2>
              <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                <ProductBodyText text={descriptionText} />
              </div>
            </section>

            {featureBullets.length > 0 ? (
              <section aria-labelledby="features-heading">
                <h2 id="features-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                  Öne çıkan özellikler
                </h2>
                <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:gap-6">
                  {featureBullets.map((line) => (
                    <li
                      key={line}
                      className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-emerald-200/80 hover:shadow-md lg:p-7"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 lg:h-14 lg:w-14">
                        <Check className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-semibold leading-snug text-slate-900">{line}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {product.licenseRequired ? (
              <section aria-labelledby="license-info-heading" className="scroll-mt-24">
                <h2 id="license-info-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                  Lisans bilgisi
                </h2>
                <div className="mt-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 text-slate-700 sm:p-8">
                  <p className="text-base leading-relaxed">
                    Bu ürün <strong>merkezi lisans sunucusu</strong> üzerinden lisanslanır. Ödeme onayı sonrası lisans
                    anahtarı ve kurulum bilgileri e-posta adresinize gönderilir.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {product.licenseDays != null && product.licenseDays > 0 ? (
                      <li>Lisans süresi: {product.licenseDays} gün</li>
                    ) : null}
                    {product.licenseMaxDevices != null && product.licenseMaxDevices > 0 ? (
                      <li>Maksimum cihaz: {product.licenseMaxDevices}</li>
                    ) : null}
                  </ul>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="hidden w-full min-w-0 lg:block lg:sticky lg:top-24 lg:self-start xl:top-28">
            <PurchasePanel {...purchasePanelProps} />
          </aside>
        </div>
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-6 sm:pb-8"
        aria-live="polite"
      >
        {toast ? (
          <div className="pointer-events-auto max-w-md rounded-xl border border-emerald-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 shadow-2xl ring-1 ring-emerald-900/10">
            {toast}
          </div>
        ) : null}
      </div>
    </div>
  )
}
