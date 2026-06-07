import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Download,
  FileSpreadsheet,
  HardDrive,
  KeyRound,
  Shield,
  ShieldCheck,
  X,
  ZoomIn,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StaticImage } from '../components/ui/StaticImage'
import { frontendImages } from '../data/frontendImages'
import { Card } from '../components/ui/Card'
import { FAQItem } from '../components/ui/FAQItem'
import { SectionHeader } from '../components/ui/SectionHeader'
import { fetchSifreKasasiStats, type SifreKasasiDownloadStats } from '../api/downloads'

const SEO_TITLE = 'Woontegra Şifre Kasası | Ücretsiz Windows Şifre Yönetim Aracı'
const SEO_DESCRIPTION =
  'Giriş URL\'lerinizi, kullanıcı adlarınızı, şifrelerinizi ve notlarınızı yerel ve şifreli şekilde saklayabileceğiniz ücretsiz Windows masaüstü aracı.'

const PAGE_CONTAINER_CLASS = 'mx-auto max-w-[1200px] px-6 md:px-8 lg:px-10'
const HERO_CONTAINER_CLASS = 'mx-auto max-w-[1440px] px-6 md:px-10 xl:px-12'

const APP_VERSION = '1.0.0'
const APP_PLATFORM = 'Windows'
const SETUP_DOWNLOAD_URL =
  'https://websitebackend-production-ab6e.up.railway.app/api/public/downloads/sifre-kasasi/setup'
const PORTABLE_DOWNLOAD_URL =
  'https://websitebackend-production-ab6e.up.railway.app/api/public/downloads/sifre-kasasi/portable'
const APP_SCREENSHOT_URL = frontendImages.sifreKasasiScreenshot

const SECURITY_CARDS = [
  {
    icon: HardDrive,
    title: 'Yerel Çalışır',
    description: 'Verileriniz kendi bilgisayarınızda saklanır.',
  },
  {
    icon: KeyRound,
    title: 'Ana Şifre ile Koruma',
    description: 'Kasa dosyası ana şifrenizle şifrelenir.',
  },
  {
    icon: Shield,
    title: 'Şifreli Yedek',
    description: '.enc yedek dosyası oluşturabilir, güvenli şekilde saklayabilirsiniz.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Excel Dışa Aktarım',
    description: 'Güvenli veya tam Excel çıktısı alabilirsiniz.',
  },
]

const FEATURES = [
  'Giriş URL\'si, kullanıcı adı, şifre ve not saklama',
  'Kategori / klasör yönetimi',
  'Şifre göster / gizle',
  'URL, kullanıcı adı ve şifre kopyalama',
  'Siteyi tarayıcıda açma',
  'Güçlü şifre üretici',
  'Şifre gücü göstergesi',
  'Otomatik kilitleme',
  'Şifreli yedek alma ve geri yükleme',
  'Güvenli Excel ve tam Excel dışa aktarım',
  'Kurulumlu ve portable Windows sürümü',
]

const FAQ_ITEMS = [
  {
    question: 'Program ücretli mi?',
    answer: 'Program ücretsizdir.',
  },
  {
    question: 'Verilerim Woontegra\'ya gönderiliyor mu?',
    answer: 'Veriler Woontegra sunucularına gönderilmez.',
  },
  {
    question: 'Ana şifremi unutursam ne olur?',
    answer: 'Ana şifre unutulursa kayıtlar kurtarılamayabilir.',
  },
  {
    question: 'Bulutta saklayabilir miyim?',
    answer: 'Şifreli .enc yedek dosyası kullanıcı tarafından bulutta saklanabilir.',
  },
  {
    question: 'Mac sürümü var mı?',
    answer: 'İlk sürüm Windows içindir, macOS sürümü ilerleyen dönemde planlanmaktadır.',
  },
]

function usePageSeo() {
  useEffect(() => {
    document.title = SEO_TITLE
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', SEO_DESCRIPTION)
  }, [])
}

function VersionInfo({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const badgeClass =
    variant === 'dark'
      ? 'border-white/15 bg-white/10 text-slate-200'
      : 'border-slate-200 bg-white text-surface-700 shadow-sm'
  const labelClass = variant === 'dark' ? 'text-white' : 'text-heading'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm md:text-base ${badgeClass}`}>
        <span className={`font-semibold ${labelClass}`}>Sürüm:</span>
        <span>{APP_VERSION}</span>
      </span>
      <span className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm md:text-base ${badgeClass}`}>
        <span className={`font-semibold ${labelClass}`}>Platform:</span>
        <span>{APP_PLATFORM}</span>
      </span>
    </div>
  )
}

function TrustNote() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 backdrop-blur-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
        <ShieldCheck className="h-5 w-5 text-emerald-300" />
      </div>
      <p className="text-sm leading-relaxed text-emerald-50 md:text-base">
        <span className="font-semibold text-white">Ücretsizdir.</span> Verileriniz bilgisayarınızda kalır.
        Woontegra sunucularına gönderilmez.
      </p>
    </div>
  )
}

function formatDownloadCount(count: number): string {
  return count.toLocaleString('tr-TR')
}

function DownloadStatsBox({
  stats,
  loading,
  failed,
  compact = false,
}: {
  stats: SifreKasasiDownloadStats | null
  loading: boolean
  failed: boolean
  compact?: boolean
}) {
  if (loading) {
    return (
      <div
        className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm ${compact ? 'px-4 py-3' : 'px-5 py-4'}`}
      >
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        <div className="mt-2 h-7 w-16 animate-pulse rounded bg-white/10" />
      </div>
    )
  }

  if (failed || !stats) {
    return (
      <div
        className={`rounded-xl border border-white/10 bg-white/5 text-sm text-slate-300 backdrop-blur-sm ${compact ? 'px-4 py-3' : 'px-5 py-4'}`}
      >
        Yeni yayınlandı
      </div>
    )
  }

  if (compact) {
    return (
      <div className="rounded-xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <div>
            <p className="text-xs font-medium text-slate-400">Toplam indirme</p>
            <p className="text-2xl font-bold tracking-tight text-white">
              {formatDownloadCount(stats.total)}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
            <span>
              Kurulum:{' '}
              <span className="font-semibold text-slate-200">{formatDownloadCount(stats.setup)}</span>
            </span>
            <span>
              Portable:{' '}
              <span className="font-semibold text-slate-200">{formatDownloadCount(stats.portable)}</span>
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/8 px-5 py-4 backdrop-blur-sm">
      <p className="text-sm font-medium text-slate-300">Toplam indirme</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-white">
        {formatDownloadCount(stats.total)}
      </p>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
        <span>
          Kurulum: <span className="font-semibold text-slate-200">{formatDownloadCount(stats.setup)}</span>
        </span>
        <span>
          Portable: <span className="font-semibold text-slate-200">{formatDownloadCount(stats.portable)}</span>
        </span>
      </div>
    </div>
  )
}

function DownloadCountLabel({ count, loading }: { count: number | null; loading: boolean }) {
  if (loading) {
    return <span className="mt-3 inline-block h-4 w-28 animate-pulse rounded bg-slate-200" />
  }
  if (count === null) return null
  return (
    <p className="mt-3 text-sm text-surface-500">
      {formatDownloadCount(count)} kez indirildi
    </p>
  )
}

function AppScreenshot() {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expanded) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [expanded])

  return (
    <>
      <div className="relative w-full max-w-[980px] justify-self-end overflow-visible xl:max-w-[1040px]">
        <div
          className="pointer-events-none absolute -inset-5 rounded-3xl bg-gradient-to-br from-accent-blue/20 to-accent-green/15 blur-2xl md:-inset-8"
          aria-hidden
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="group relative w-full overflow-visible rounded-2xl border border-white/15 text-left shadow-2xl shadow-black/40 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          aria-label="Uygulama ekran görüntüsünü büyüt"
        >
          <StaticImage
            src={APP_SCREENSHOT_URL}
            alt="Woontegra Şifre Kasası uygulama ekranı"
            className="block h-auto w-full rounded-2xl object-contain"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200">
            <ZoomIn className="h-3.5 w-3.5" />
            Büyüt
          </span>
        </button>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Woontegra Şifre Kasası ekran görüntüsü"
          onClick={() => setExpanded(false)}
        >
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="absolute right-4 top-4 rounded-xl border border-white/15 bg-slate-900/80 p-2 text-white transition-colors hover:bg-slate-800"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
          <StaticImage
            src={APP_SCREENSHOT_URL}
            alt="Woontegra Şifre Kasası uygulama ekranı — büyük görünüm"
            className="max-h-[90vh] max-w-[min(1200px,95vw)] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export function SifreKasasiPage() {
  usePageSeo()
  const [stats, setStats] = useState<SifreKasasiDownloadStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsFailed, setStatsFailed] = useState(false)

  const loadStats = useCallback(async () => {
    const data = await fetchSifreKasasiStats()
    if (!data) {
      setStatsFailed(true)
      setStats(null)
    } else {
      setStatsFailed(false)
      setStats(data)
    }
    setStatsLoading(false)
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-24 lg:min-h-[760px] lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_35%,rgba(37,99,235,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_65%,rgba(34,197,94,0.18),transparent_55%)]" />
        <div className={`${HERO_CONTAINER_CLASS} relative z-10 flex min-h-[inherit] items-center`}>
          <div className="grid w-full items-center gap-12 lg:grid-cols-[520px_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            <div className="flex max-w-[520px] flex-col gap-6 text-white lg:gap-7">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-5 py-2 text-sm font-medium text-emerald-100">
                <Shield className="h-4 w-4 text-emerald-300" />
                Ücretsiz Windows Aracı — Yerel ve Şifreli
              </div>
              <div className="space-y-5">
                <h1 className="text-4xl font-bold leading-[1.12] tracking-tight md:text-5xl xl:text-6xl xl:leading-[1.08]">
                  Woontegra Şifre Kasası
                </h1>
                <p className="text-xl font-medium leading-relaxed text-slate-200 md:text-2xl md:leading-snug">
                  Giriş bilgilerinizi güvenli, düzenli ve kolay erişilebilir şekilde saklayın.
                </p>
                <p className="text-base leading-8 text-slate-400 md:text-lg">
                  Şifrelerinizi, giriş URL&apos;lerinizi, kullanıcı adlarınızı ve notlarınızı Excel dosyaları
                  yerine yerel ve şifreli bir masaüstü uygulamasında yönetin.
                </p>
              </div>

              <VersionInfo variant="dark" />

              <div className="flex flex-col gap-3">
                <Button variant="hero" size="xl" href={SETUP_DOWNLOAD_URL} target="_self" className="w-full sm:w-auto">
                  <Download className="mr-2 h-5 w-5" />
                  Windows Kurulum Sürümünü İndir
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  href={PORTABLE_DOWNLOAD_URL}
                  target="_self"
                  className="w-full border-white/35 text-white hover:bg-white hover:text-slate-900 sm:w-auto"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Portable Sürümü İndir
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                <TrustNote />
                <DownloadStatsBox
                  stats={stats}
                  loading={statsLoading}
                  failed={statsFailed}
                  compact
                />
              </div>
            </div>

            <div className="grid w-full overflow-visible lg:justify-items-end">
              <AppScreenshot />
            </div>
          </div>
        </div>
      </section>

      {/* Güvenlik Kartları */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className={PAGE_CONTAINER_CLASS}>
          <SectionHeader
            title="Güvenlik Öncelikli Tasarım"
            subtitle="Verileriniz yalnızca sizin cihazınızda kalır; buluta aktarılmaz."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY_CARDS.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-7 md:p-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-blue-soft">
                  <Icon className="h-7 w-7 text-accent-blue" />
                </div>
                <h3 className="text-xl font-semibold text-heading">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-surface-600">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-20 md:py-24">
        <div className={PAGE_CONTAINER_CLASS}>
          <SectionHeader title="Öne Çıkan Özellikler" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-5 py-4 text-surface-700"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-green" />
                <span className="text-base leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* İndirme Kartları */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className={PAGE_CONTAINER_CLASS}>
          <SectionHeader
            title="İndir"
            subtitle="İhtiyacınıza uygun sürümü seçerek hemen kullanmaya başlayın."
          />
          <div className="mb-10 flex justify-center">
            <VersionInfo />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card
              variant="elevated"
              className="flex flex-col border-2 border-accent-blue/15 bg-gradient-to-br from-white to-accent-blue-soft/30 p-8 md:p-10"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-blue-soft">
                <Download className="h-7 w-7 text-accent-blue" />
              </div>
              <h3 className="text-2xl font-semibold text-heading">Kurulum Sürümü</h3>
              <p className="mt-4 flex-1 text-base leading-relaxed text-surface-600">
                Bilgisayarınıza normal bir Windows programı gibi kurulur. Başlat menüsünden kolayca
                açabilirsiniz.
              </p>
              <DownloadCountLabel count={stats?.setup ?? null} loading={statsLoading} />
              <Button variant="primary" size="xl" href={SETUP_DOWNLOAD_URL} target="_self" className="mt-6 w-full">
                <Download className="mr-2 h-5 w-5" />
                Setup İndir
              </Button>
            </Card>
            <Card
              variant="elevated"
              className="flex flex-col border-2 border-accent-green/20 bg-gradient-to-br from-white to-accent-green-soft/40 p-8 md:p-10"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-green-soft">
                <HardDrive className="h-7 w-7 text-accent-green" />
              </div>
              <h3 className="text-2xl font-semibold text-heading">Portable Sürüm</h3>
              <p className="mt-4 flex-1 text-base leading-relaxed text-surface-600">
                Kurulum gerektirmez. İndirip doğrudan çalıştırabilirsiniz.
              </p>
              <DownloadCountLabel count={stats?.portable ?? null} loading={statsLoading} />
              <Button variant="green" size="xl" href={PORTABLE_DOWNLOAD_URL} target="_self" className="mt-6 w-full">
                <Download className="mr-2 h-5 w-5" />
                Portable İndir
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Önemli Bilgilendirme */}
      <section className="py-20 md:py-24">
        <div className={PAGE_CONTAINER_CLASS}>
          <Card hover={false} className="border-amber-200 bg-amber-50/60 p-8 md:p-10">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-heading">Önemli Bilgilendirme</h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-surface-700">
                  <p>
                    Woontegra Şifre Kasası yerel çalışan bir masaüstü uygulamasıdır. Uygulama içindeki
                    kayıtlar kullanıcının kendi bilgisayarında saklanır ve Woontegra sunucularına
                    gönderilmez.
                  </p>
                  <p>
                    Ana şifrenizi unutmanız halinde kayıtlarınız Woontegra tarafından kurtarılamaz. Bu
                    nedenle ana şifrenizi güvenli şekilde saklamanız ve düzenli olarak şifreli yedek
                    almanız önerilir.
                  </p>
                  <p>
                    Kullanıcı, kendi cihaz güvenliğinden, ana şifresinden, yedek dosyalarından ve dışa
                    aktardığı Excel dosyalarından sorumludur.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* SSS */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className={PAGE_CONTAINER_CLASS}>
          <SectionHeader title="Sık Sorulan Sorular" />
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
