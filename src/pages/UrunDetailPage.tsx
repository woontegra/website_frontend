import { useEffect, useState, type ReactNode } from 'react'
import { isAxiosError } from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Banknote,
  Check,
  Cloud,
  CreditCard,
  Download,
  HardDrive,
  Heart,
  HelpCircle,
  Mail,
  Monitor,
  Receipt,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  WifiOff,
} from 'lucide-react'
import { productsPublicApi, type PublicProductDetail } from '../api/products-public'
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

const HERO_TRUST = [
  { label: 'Tek seferlik ödeme', icon: Banknote },
  { label: 'İndir-kullan', icon: Download },
  { label: 'Çevrimdışı kullanım', icon: WifiOff },
  { label: 'Windows uyumlu', icon: Monitor },
] as const

const SAAS_HERO_TRUST = [
  { label: 'Web tabanlı erişim', icon: Cloud },
  { label: 'Yıllık kullanım', icon: Banknote },
  { label: 'Birden fazla kullanıcı', icon: Users },
  { label: 'Woontegra hesap desteği', icon: ShieldCheck },
] as const

const FEATURE_CARDS = [
  {
    title: 'Müvekkil bazlı kasa takibi',
    body: 'Dosya ve müvekkil bazında kasa hareketlerini düzenli şekilde kaydedin.',
    icon: Scale,
  },
  {
    title: 'Tahsilat ve ödeme kayıtları',
    body: 'Gelen ve giden ödemeleri tek ekrandan izleyin; raporlamayı kolaylaştırın.',
    icon: Receipt,
  },
  {
    title: 'Masraf ve bakiye takibi',
    body: 'Masrafları ve bakiyeyi anlık görün; ofis içi kontrolü güçlendirin.',
    icon: HardDrive,
  },
  {
    title: 'Yerel ve hızlı kullanım',
    body: 'Veriler cihazınızda kalır; gecikmesiz, odaklı bir masaüstü deneyimi.',
    icon: Sparkles,
  },
] as const

const AUDIENCE_CARDS = [
  { title: 'Avukatlar', body: 'Günlük dosya ve mali takibi tek programda toplamak isteyen avukatlar için.', icon: Scale },
  { title: 'Hukuk büroları', body: 'Ekip içi süreçleri sadeleştirmek isteyen küçük ve orta ölçekli bürolar.', icon: Users },
  {
    title: 'Müvekkil hesap takibi yapan ofisler',
    body: 'Müvekkil hesaplarına özel kasa ve bakiye takibi gerektiren ofisler.',
    icon: Receipt,
  },
] as const

const SAAS_AUDIENCE_CARDS = [
  {
    title: 'Hukuk büroları',
    body: 'Web üzerinden müvekkil kasa, avans, masraf ve vekalet taksiti takibi isteyen ekipler.',
    icon: Users,
  },
  {
    title: 'Çok kullanıcılı çalışan ofisler',
    body: 'Yetkilendirme ve büro yapısı ile birden fazla kullanıcıyla güvenli erişim.',
    icon: ShieldCheck,
  },
  {
    title: 'SMM ve tahsilat takibi',
    body: 'Tahsilat makbuzu ve SMM bekleyen tahsilat uyarılarıyla mali disiplin.',
    icon: Receipt,
  },
] as const

/** Admin’de madde yoksa web tabanlı ürün sayfasında gösterilecek yedek liste */
const SAAS_FEATURE_FALLBACK = [
  'Web tabanlı kullanım',
  'Birden fazla kullanıcıyla büro içi kullanım',
  'Müvekkil ve dosya takibi',
  'Avans ve masraf takibi',
  'Vekalet ücreti ve taksit yönetimi',
  'Kısmi ödeme desteği',
  'Tahsilat makbuzu',
  'SMM bekleyen tahsilat uyarıları',
  'Kullanıcı yetkilendirme',
  'Hesap ve kullanım yönetimi Woontegra tarafından desteklenir',
] as const

const HOW_STEPS = [
  { step: 1, title: 'Programı satın al', body: 'Ödeme sayfasında bilgilerinizi girin; güvenli ödeme ile siparişi tamamlayın.' },
  { step: 2, title: 'Ödeme sonrası indirme bağlantısını al', body: 'Onay sonrası indirme bağlantısı e-posta ve sipariş başarı sayfasında sunulur.' },
  { step: 3, title: 'Bilgisayarına kurup kullanmaya başla', body: 'Kurulum sihirbazı ile Windows üzerinde hızlıca devreye alın.' },
] as const

const SAAS_HOW_STEPS = [
  {
    step: 1,
    title: 'Sepete ekleyin ve ödeyin',
    body: 'Ürünü sepete ekleyin; ödeme sayfasında bilgilerinizi girerek PayTR ile güvenle ödeyin.',
  },
  {
    step: 2,
    title: 'Büronuz için hesap açılır',
    body: 'Ödeme onayından sonra Woontegra, büronuz için kullanım hesabını ve erişimi tarafımızca oluşturur.',
  },
  {
    step: 3,
    title: 'E-posta ile giriş bilgileriniz',
    body: 'Programa giriş adresi ve ilk kullanıcı bilgileri sipariş e-postanıza gönderilir; tarayıcıdan kullanmaya başlayabilirsiniz.',
  },
] as const

const FAQ_ITEMS = [
  {
    q: 'İnternetsiz çalışır mı?',
    a: 'Evet. Program yerel olarak çalışır; temel kullanım için sürekli internet bağlantısı gerekmez.',
  },
  {
    q: 'Lisans anahtarı gerekiyor mu?',
    a: 'Satın alma ve lisanslama akışı ödeme altyapısı ile birlikte netleştirilecek; şimdilik bilgilendirme amaçlıdır.',
  },
  {
    q: 'Ödeme sonrası programı nereden indireceğim?',
    a: 'Onaylandığında indirme bağlantısı e-posta ve sipariş ekranında paylaşılacaktır; public sayfada yayımlanmaz.',
  },
  {
    q: 'Program Windows ile uyumlu mu?',
    a: 'Evet. Windows masaüstü ortamı için tasarlanmıştır; sürüm notları ürün güncellemeleriyle paylaşılır.',
  },
  {
    q: 'Güncelleme olacak mı?',
    a: 'Ürün yaşam döngüsüne göre hata düzeltmeleri ve iyileştirmeler planlanabilir; duyurular web sitesinden yapılır.',
  },
] as const

const FAQ_WEB_PRODUCT_TOP = [
  {
    q: 'Hesabı kendim mi oluşturuyorum?',
    a: 'Hayır. Sipariş ve ödeme onayından sonra Woontegra, büronuz için firma hesabını ve ilk kullanıcıyı oluşturur; giriş bilgileri e-posta ile gönderilir.',
  },
  {
    q: 'Yıllık kullanım nasıl işler?',
    a: 'Gördüğünüz fiyat bir yıllık kullanım içindir. Süre, ürün kaydında belirtilen ay sayısıdır; uzatma için bizimle iletişime geçebilirsiniz.',
  },
] as const

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

function PurchaseBox({
  product,
  supportEmail,
  canPurchase,
  isWebProduct,
  webUsageYears,
  onWebUsageYearsChange,
  onSepeteEkle,
  onSatınAlCheckout,
  onScrollToDetails,
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
  favoriteButton?: ReactNode
}) {
  const compare = formatComparePrice(product)
  const periodSuffix = productPricePeriodSuffix(product.productType)

  const desktopBulletLines = [
    'Tek seferlik satın alma',
    'Güvenli ödeme',
    'Ödeme sonrası indirme bağlantısı',
    'E-posta ile sipariş bilgisi',
    'Yerel / çevrimdışı kullanım',
  ]

  const webBulletLines = [
    'Yıllık kullanım',
    'PayTR ile güvenli ödeme',
    'Hesabınız Woontegra tarafından açılır',
    'Giriş bilgileriniz e-posta ile gönderilir',
    'Birden fazla kullanıcıyla büro içi kullanım',
    `Kullanım süresi: ${product.licenseMonths ?? 12} ay`,
  ]

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl ring-1 ring-slate-900/[0.06] sm:p-8 lg:min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 lg:text-sm">
            <ShieldCheck className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" aria-hidden />
            Satın alma
          </div>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">{product.name}</h2>
        </div>
        {favoriteButton ? (
          <div className="shrink-0 pt-0.5">{favoriteButton}</div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="inline-flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0">
          <span className="text-3xl font-bold text-emerald-700 lg:text-4xl">{formatProductPrice(product)}</span>
          {periodSuffix ? (
            <span className="text-sm font-medium text-slate-500 lg:text-base">{periodSuffix}</span>
          ) : null}
        </span>
        {compare && <span className="text-lg text-slate-400 line-through lg:text-xl">{compare}</span>}
        {isWebProduct ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
            Yıllık kullanım
          </span>
        ) : null}
      </div>

      <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm leading-snug text-slate-700 lg:text-[15px] lg:leading-relaxed">
        {(isWebProduct ? webBulletLines : desktopBulletLines).map((line) => (
          <li key={line} className="flex gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 lg:h-5 lg:w-5" aria-hidden />
            <span>{line}</span>
          </li>
        ))}
        {!isWebProduct ? (
          <li className="flex gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 lg:h-5 lg:w-5" aria-hidden />
            <span>
              <span className="font-medium text-slate-800">Sürüm:</span>{' '}
              {product.version?.trim() || 'Belirtilmedi'}
            </span>
          </li>
        ) : null}
        <li className="flex gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 lg:h-5 lg:w-5" aria-hidden />
          <span>
            <span className="font-medium text-slate-800">Destek e-postası:</span>{' '}
            <a href={`mailto:${supportEmail}`} className="font-semibold text-accent-blue underline-offset-2 hover:underline">
              {supportEmail}
            </a>
          </span>
        </li>
      </ul>

      {isWebProduct ? (
        <p className="mt-6 rounded-xl border border-amber-200/90 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950 lg:text-sm">
          Bu web tabanlı programda kullanıcı hesabınız Woontegra tarafından oluşturulur. Siparişiniz ve ödemeniz
          tamamlandıktan sonra giriş bilgileriniz e-posta adresinize gönderilir.
        </p>
      ) : null}

      {isWebProduct && canPurchase ? (
        <div className="mt-6 space-y-2">
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
                {y} yıl
              </option>
            ))}
          </select>
          <p className="text-xs leading-relaxed text-slate-600">
            Toplam tutar, birim yıllık fiyatın seçtiğiniz yıl sayısı ile çarpımıdır.
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        {canPurchase ? (
          <>
            <button
              type="button"
              onClick={onSepeteEkle}
              className="flex w-full flex-1 items-center justify-center rounded-xl bg-emerald-600 py-4 text-center text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:py-[1.125rem] sm:text-lg"
            >
              Sepete Ekle
            </button>
            <button
              type="button"
              onClick={onSatınAlCheckout}
              className="flex w-full flex-1 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white py-4 text-center text-base font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:py-[1.125rem] sm:text-lg"
            >
              Satın Al
            </button>
          </>
        ) : (
          <>
            {isWebProduct ? (
              <p className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium leading-relaxed text-slate-700">
                Bu web tabanlı ürün için online satın alma şu anda kapalıdır. Detaylı bilgi için bizimle iletişime
                geçebilirsiniz.
              </p>
            ) : null}
            <button
              type="button"
              onClick={onScrollToDetails}
              className="w-full rounded-xl border-2 border-slate-200 bg-white py-4 text-center text-base font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:py-[1.125rem] sm:text-lg"
            >
              Ürün açıklamasına git
            </button>
          </>
        )}
      </div>

      <p className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-xs leading-relaxed text-slate-600 lg:text-sm">
        <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 lg:h-5 lg:w-5" aria-hidden />
        {isWebProduct
          ? 'Ödeme PayTR ile güvenli şekilde alınır. Web tabanlı programa erişim bilgileriniz ödeme onayından sonra e-posta ile gönderilir.'
          : 'Ödeme PayTR ile güvenli şekilde alınır. İndirme bağlantısı yalnızca ödeme onayı sonrası e-posta ve sipariş sayfasında paylaşılır.'}
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
    if (import.meta.env.DEV) {
      console.debug('[UrunDetailPage]', { productSlug, requestUrl })
    }
    void (async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productsPublicApi.getBySlug(productSlug)
        if (!cancelled) {
          setProduct(data)
          if (import.meta.env.DEV) {
            console.debug('[UrunDetailPage]', {
              productSlug,
              requestUrl,
              responseStatus: 200,
              productId: data.id,
              productSlugResolved: data.slug,
            })
          }
        }
      } catch (err) {
        if (!cancelled) {
          setProduct(null)
          setError('Ürün bulunamadı.')
          if (import.meta.env.DEV) {
            const status = isAxiosError(err) ? err.response?.status : undefined
            const responseData = isAxiosError(err) ? err.response?.data : undefined
            console.debug('[UrunDetailPage]', {
              productSlug,
              requestUrl,
              responseStatus: status,
              responseData,
            })
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

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-4 py-20 text-center text-slate-600 sm:px-6 lg:px-8">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" aria-hidden />
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

  const isSaaS = product.productType === 'SAAS' || product.productType === 'SERVICE'
  const canPurchase =
    product.productType === 'DOWNLOAD' || (isSaaS && product.purchaseEnabled !== false)

  const scrollToProductDetails = () => {
    document.getElementById('product-desc-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSepeteEkle = () => {
    if (!product || !canPurchase) {
      showToast()
      return
    }
    const snapshot = cartSnapshotFromProduct(product)
    if (isSaaS) {
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
    if (isSaaS) {
      addToCart(product.id, webUsageYears, { snapshot, replaceLine: true })
    } else {
      addToCart(product.id, 1, { snapshot })
    }
    navigate('/checkout')
  }

  const title = product.seoTitle?.trim() || product.name
  const defaultLeadDesktop = 'İş süreçlerinizi hızlandıran, yerelde çalışan pratik bir masaüstü çözümü.'
  const defaultLeadSaaS =
    'Hukuk büroları için web tabanlı müvekkil, dosya, avans, masraf, vekalet taksiti ve SMM takip sistemi.'
  const lead =
    product.shortDescription?.trim() ||
    product.seoDescription?.trim() ||
    (isSaaS ? defaultLeadSaaS : defaultLeadDesktop)

  const parsedFeatureBullets: string[] = (() => {
    const fromDb =
      product.featureBullets
        ?.split(/\n/)
        .map((s) => s.trim())
        .filter(Boolean) ?? []
    if (fromDb.length > 0) return fromDb
    return isSaaS ? [...SAAS_FEATURE_FALLBACK] : []
  })()
  const showDynamicFeatures = parsedFeatureBullets.length > 0

  const heroTrust = isSaaS ? SAAS_HERO_TRUST : HERO_TRUST
  const howSteps = isSaaS ? SAAS_HOW_STEPS : HOW_STEPS
  const audienceCards = isSaaS ? SAAS_AUDIENCE_CARDS : AUDIENCE_CARDS
  const faqItems = [...(isSaaS ? FAQ_WEB_PRODUCT_TOP : []), ...FAQ_ITEMS]

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

  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50/80 pb-28 lg:pb-32">
      <section
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white"
        aria-labelledby="product-hero-title"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,rgba(34,197,94,0.2),transparent_58%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_65%,rgba(59,130,246,0.12),transparent_52%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" aria-hidden />

        <div className="relative mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <nav className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-slate-400" aria-label="Sayfa konumu">
            <Link to="/urunler" className="font-semibold text-slate-300 transition hover:text-white">
              Ürünler
            </Link>
            <span className="text-slate-600">/</span>
            {product.category && (
              <>
                <Link
                  to={`/kategori/${product.category.slug}`}
                  className="font-semibold text-emerald-300/95 transition hover:text-emerald-200"
                >
                  {product.category.name}
                </Link>
                <span className="text-slate-600">/</span>
              </>
            )}
            <span className="font-medium text-slate-200">{product.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {product.category ? (
              <Link
                to={`/kategori/${product.category.slug}`}
                className="inline-flex items-center rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-100 backdrop-blur-sm transition hover:border-emerald-300/50 hover:bg-emerald-500/25 lg:px-4 lg:text-sm"
              >
                {product.category.name}
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-100 backdrop-blur-sm lg:px-4 lg:text-sm">
                {isSaaS ? 'Web tabanlı program' : 'Masaüstü Yazılım'}
              </span>
            )}
          </div>

          <h1
            id="product-hero-title"
            className="mt-5 max-w-[min(100%,52rem)] text-3xl font-bold tracking-tight text-white sm:text-4xl lg:mt-6 lg:text-5xl lg:leading-[1.08]"
          >
            {title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl lg:mt-6 lg:text-[1.35rem] lg:leading-relaxed">
            {lead}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2.5 pb-1 sm:mt-7 lg:mt-7 lg:gap-3">
            {heroTrust.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-100 shadow-sm backdrop-blur-sm sm:text-sm lg:px-4 lg:text-base"
              >
                <Icon className="h-4 w-4 shrink-0 text-emerald-400 lg:h-[1.125rem] lg:w-[1.125rem]" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1240px] px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(26rem,34%)] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_28rem] xl:gap-14">
          <div className="min-w-0 space-y-12 lg:space-y-16 xl:space-y-20">
            <div className="lg:hidden">
              <PurchaseBox
                product={product}
                supportEmail={supportEmail}
                canPurchase={canPurchase}
                isWebProduct={isSaaS}
                webUsageYears={webUsageYears}
                onWebUsageYearsChange={setWebUsageYears}
                onSepeteEkle={handleSepeteEkle}
                onSatınAlCheckout={handleSatınAlCheckout}
                onScrollToDetails={scrollToProductDetails}
                favoriteButton={favoriteButton}
              />
            </div>

            <ProductImageGallery
              productName={product.name}
              coverImage={product.coverImage}
              galleryImages={product.galleryImages ?? []}
            />

            <section aria-labelledby="product-desc-heading" className="scroll-mt-24">
              <h2 id="product-desc-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                Ürün hakkında
              </h2>
              <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                <ProductBodyText text={product.description || 'Bu ürün için açıklama yakında eklenecek.'} />
              </div>
            </section>

            <section aria-labelledby="features-heading">
              <h2 id="features-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                Öne çıkan özellikler
              </h2>
              <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:gap-6">
                {showDynamicFeatures
                  ? parsedFeatureBullets.map((line) => (
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
                    ))
                  : FEATURE_CARDS.map(({ title, body, icon: Icon }) => (
                      <li
                        key={title}
                        className="flex gap-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-emerald-200/80 hover:shadow-md lg:p-7"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 lg:h-14 lg:w-14">
                          <Icon className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                          <p className="mt-2 text-base leading-relaxed text-slate-600">{body}</p>
                        </div>
                      </li>
                    ))}
              </ul>
            </section>

            <section aria-labelledby="audience-heading">
              <h2 id="audience-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                Kimler için uygun?
              </h2>
              <ul className="mt-7 grid gap-5 md:grid-cols-3 lg:mt-8 lg:gap-6">
                {audienceCards.map(({ title, body, icon: Icon }) => (
                  <li
                    key={title}
                    className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-6 text-center shadow-sm sm:p-7 lg:p-8"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/80 lg:h-16 lg:w-16">
                      <Icon className="h-7 w-7" aria-hidden />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">{body}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="how-heading">
              <h2 id="how-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                Nasıl çalışır?
              </h2>
              <ol className="mt-7 grid gap-5 md:grid-cols-3 lg:mt-8 lg:gap-6">
                {howSteps.map(({ step, title, body }) => (
                  <li
                    key={step}
                    className="flex min-h-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm lg:p-7"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white lg:h-12 lg:w-12 lg:text-base">
                      {step}
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">{body}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="faq-heading" className="pb-6 lg:pb-8">
              <h2 id="faq-heading" className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-900">
                <HelpCircle className="h-7 w-7 shrink-0 text-emerald-700 lg:h-8 lg:w-8" aria-hidden />
                Sık sorulan sorular
              </h2>
              <div className="mt-7 divide-y divide-slate-200 rounded-2xl border border-slate-200/90 bg-white shadow-sm lg:mt-8">
                {faqItems.map(({ q, a }, i) => (
                  <details key={`faq-${i}`} className="group px-6 py-5 first:rounded-t-2xl last:rounded-b-2xl lg:px-8 lg:py-5">
                    <summary className="cursor-pointer list-none text-base font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden lg:text-lg">
                      <span className="flex items-start justify-between gap-4">
                        {q}
                        <span className="mt-0.5 shrink-0 text-slate-400 transition group-open:rotate-180">▼</span>
                      </span>
                    </summary>
                    <p className="mt-4 text-base leading-relaxed text-slate-600">{a}</p>
                  </details>
                ))}
              </div>
            </section>

            {!isSaaS ? (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 lg:hidden">
                İndirme bağlantısı güvenlik nedeniyle public sayfada gösterilmez; ödeme onayı sonrası e-posta ve sipariş ekranında sunulur.
              </div>
            ) : null}
          </div>

          <aside className="hidden w-full min-w-0 lg:block lg:sticky lg:top-24 lg:self-start xl:top-28">
            <PurchaseBox
              product={product}
              supportEmail={supportEmail}
              canPurchase={canPurchase}
              isWebProduct={isSaaS}
              webUsageYears={webUsageYears}
              onWebUsageYearsChange={setWebUsageYears}
              onSepeteEkle={handleSepeteEkle}
              onSatınAlCheckout={handleSatınAlCheckout}
              onScrollToDetails={scrollToProductDetails}
              favoriteButton={favoriteButton}
            />
          </aside>
        </div>
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-6 sm:pb-8"
        aria-live="polite"
      >
        {toast && (
          <div className="pointer-events-auto max-w-md rounded-xl border border-emerald-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 shadow-2xl ring-1 ring-emerald-900/10">
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}
