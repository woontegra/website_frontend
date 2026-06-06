import { useCallback, useEffect, useState } from 'react'
import {
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Folder,
  Globe,
  HardDrive,
  KeyRound,
  Lock,
  Search,
  Shield,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { FAQItem } from '../components/ui/FAQItem'
import { SectionHeader } from '../components/ui/SectionHeader'
import {
  fetchSifreKasasiStats,
  getSifreKasasiPortableDownloadUrl,
  getSifreKasasiSetupDownloadUrl,
  type SifreKasasiDownloadStats,
} from '../api/downloads'

const SEO_TITLE = 'Woontegra Şifre Kasası | Ücretsiz Windows Şifre Yönetim Aracı'
const SEO_DESCRIPTION =
  'Giriş URL\'lerinizi, kullanıcı adlarınızı, şifrelerinizi ve notlarınızı yerel ve şifreli şekilde saklayabileceğiniz ücretsiz Windows masaüstü aracı.'

const PAGE_CONTAINER_CLASS = 'mx-auto max-w-[1200px] px-6 md:px-8 lg:px-10'

const APP_VERSION = '1.0.0'
const APP_PLATFORM = 'Windows'
const SETUP_DOWNLOAD_URL = getSifreKasasiSetupDownloadUrl()
const PORTABLE_DOWNLOAD_URL = getSifreKasasiPortableDownloadUrl()
const DOWNLOAD_BUSY_MS = 2000

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

const MOCK_ENTRIES = [
  { site: 'E-posta Hesabı', user: 'info@firma.com', strength: 'Güçlü' },
  { site: 'Bankacılık Portalı', user: 'kullanici_01', strength: 'Çok Güçlü' },
  { site: 'E-Ticaret Paneli', user: 'admin@magaza.com', strength: 'Güçlü' },
  { site: 'Bulut Depolama', user: 'yedek@firma.com', strength: 'Orta' },
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
}: {
  stats: SifreKasasiDownloadStats | null
  loading: boolean
  failed: boolean
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        <div className="mt-3 h-8 w-16 animate-pulse rounded bg-white/10" />
      </div>
    )
  }

  if (failed || !stats) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300 backdrop-blur-sm">
        Yeni yayınlandı
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

type DownloadButtonProps = {
  href: string
  variant: 'hero' | 'outline' | 'primary' | 'green'
  size?: 'lg' | 'xl'
  className?: string
  children: React.ReactNode
  onDownloadStart?: () => void
}

function DownloadButton({
  href,
  variant,
  size = 'xl',
  className = '',
  children,
  onDownloadStart,
}: DownloadButtonProps) {
  const [busy, setBusy] = useState(false)

  const handleClick = useCallback(() => {
    if (busy) return
    setBusy(true)
    onDownloadStart?.()
    window.location.assign(href)
    window.setTimeout(() => setBusy(false), DOWNLOAD_BUSY_MS)
  }, [busy, href, onDownloadStart])

  return (
    <Button
      variant={variant}
      size={size}
      disabled={busy}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  )
}

function AppScreenshotPlaceholder() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="absolute -inset-6 bg-gradient-to-br from-accent-blue/25 to-accent-green/25 blur-3xl rounded-full" />
      <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue to-accent-green rounded-3xl opacity-25 blur-md" />
      <Card
        hover={false}
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-800/80 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/90" />
            <span className="h-3 w-3 rounded-full bg-amber-400/90" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Lock className="h-3.5 w-3.5 text-accent-green" />
            Woontegra Şifre Kasası
          </div>
          <div className="w-16" />
        </div>

        <div className="flex min-h-[420px] md:min-h-[480px]">
          <div className="hidden w-44 shrink-0 border-r border-white/10 bg-slate-800/50 p-4 sm:block">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent-blue/20 px-3 py-2 text-xs font-medium text-accent-blue-light">
              <Folder className="h-3.5 w-3.5" />
              Tüm Kayıtlar
            </div>
            <div className="space-y-2">
              {['İş Hesapları', 'Kişisel', 'Bankacılık'].map((folder) => (
                <div
                  key={folder}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400"
                >
                  <Folder className="h-3.5 w-3.5" />
                  {folder}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2.5">
                <Search className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-500">Kayıt ara...</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 p-4 md:p-5">
              {MOCK_ENTRIES.map((entry) => (
                <div
                  key={entry.site}
                  className="flex items-center justify-between rounded-xl border border-white/8 bg-slate-800/70 px-4 py-3.5 transition-colors hover:border-accent-blue/30 hover:bg-slate-800"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 shrink-0 text-accent-blue-light" />
                      <span className="truncate text-sm font-medium text-slate-200">{entry.site}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{entry.user}</span>
                      <span className="text-slate-600">••••••••</span>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-400">
                        {entry.strength}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-1.5 text-slate-500">
                    <Copy className="h-3.5 w-3.5" />
                    <EyeOff className="h-3.5 w-3.5" />
                    <ExternalLink className="h-3.5 w-3.5" />
                    <ShieldCheck className="h-4 w-4 text-accent-green" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 bg-slate-800/60 px-5 py-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-accent-green" />
                Kasa kilitli — yerel depolama
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                4 kayıt
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
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

  const handleDownloadStart = useCallback(() => {
    window.setTimeout(() => {
      void loadStats()
    }, 1500)
  }, [loadStats])

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_35%,rgba(37,99,235,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_65%,rgba(34,197,94,0.18),transparent_55%)]" />
        <div className={`${PAGE_CONTAINER_CLASS} relative z-10`}>
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-5 py-2 text-sm font-medium text-emerald-100">
                <Shield className="h-4 w-4 text-emerald-300" />
                Ücretsiz Windows Aracı — Yerel ve Şifreli
              </div>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                Woontegra Şifre Kasası
              </h1>
              <p className="mt-6 text-xl font-medium leading-relaxed text-slate-200 md:text-2xl">
                Giriş bilgilerinizi güvenli, düzenli ve kolay erişilebilir şekilde saklayın.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg md:leading-8">
                Şifrelerinizi, giriş URL&apos;lerinizi, kullanıcı adlarınızı ve notlarınızı Excel dosyaları
                yerine yerel ve şifreli bir masaüstü uygulamasında yönetin.
              </p>

              <div className="mt-8">
                <VersionInfo variant="dark" />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <DownloadButton
                  variant="hero"
                  href={SETUP_DOWNLOAD_URL}
                  onDownloadStart={handleDownloadStart}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Windows Kurulum Sürümünü İndir
                </DownloadButton>
                <DownloadButton
                  variant="outline"
                  href={PORTABLE_DOWNLOAD_URL}
                  onDownloadStart={handleDownloadStart}
                  className="w-full border-white/35 text-white hover:bg-white hover:text-slate-900 sm:w-auto"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Portable Sürümü İndir
                </DownloadButton>
              </div>

              <div className="mt-8 grid max-w-2xl gap-4">
                <TrustNote />
                <DownloadStatsBox stats={stats} loading={statsLoading} failed={statsFailed} />
              </div>
            </div>

            <AppScreenshotPlaceholder />
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
              <DownloadButton
                variant="primary"
                href={SETUP_DOWNLOAD_URL}
                onDownloadStart={handleDownloadStart}
                className="mt-6 w-full"
              >
                <Download className="mr-2 h-5 w-5" />
                Setup İndir
              </DownloadButton>
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
              <DownloadButton
                variant="green"
                href={PORTABLE_DOWNLOAD_URL}
                onDownloadStart={handleDownloadStart}
                className="mt-6 w-full"
              >
                <Download className="mr-2 h-5 w-5" />
                Portable İndir
              </DownloadButton>
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
