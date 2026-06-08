import woontegraSifreKasasiEkran from '../assets/images/woontegra-sifre-kasasi-ekran.png'
import { isValidImageSrc, resolveImageUrl } from '../lib/resolveImageUrl'

export const SIFRE_KASASI_PAGE_KEY = 'sifreKasasiPage'

export type SifreKasasiPageContent = {
  enabled: boolean
  badge: string
  title: string
  subtitle: string
  description: string
  version: string
  platform: string
  setupButtonText: string
  portableButtonText: string
  trustNote: string
  statsTotalLabel: string
  statsSetupLabel: string
  statsPortableLabel: string
  statsFallbackText: string
  seoTitle: string
  seoDescription: string
  heroImageUrl: string
}

export const DEFAULT_SIFRE_KASASI_SCREENSHOT = woontegraSifreKasasiEkran

export const defaultSifreKasasiPageContent: SifreKasasiPageContent = {
  enabled: true,
  badge: 'Ücretsiz Windows Aracı — Yerel ve Şifreli',
  title: 'Woontegra Şifre Kasası',
  subtitle: 'Giriş bilgilerinizi güvenli, düzenli ve kolay erişilebilir şekilde saklayın.',
  description:
    'Şifrelerinizi, giriş URL\'lerinizi, kullanıcı adlarınızı ve notlarınızı Excel dosyaları yerine yerel ve şifreli bir masaüstü uygulamasında yönetin.',
  version: '1.0.0',
  platform: 'Windows',
  setupButtonText: 'Windows Kurulum Sürümünü İndir',
  portableButtonText: 'Portable Sürümü İndir',
  trustNote:
    'Ücretsizdir. Verileriniz bilgisayarınızda kalır. Woontegra sunucularına gönderilmez.',
  statsTotalLabel: 'Toplam indirme',
  statsSetupLabel: 'Kurulum',
  statsPortableLabel: 'Portable',
  statsFallbackText: 'Yeni yayınlandı',
  seoTitle: 'Woontegra Şifre Kasası | Ücretsiz Windows Şifre Yönetim Aracı',
  seoDescription:
    'Giriş URL\'lerinizi, kullanıcı adlarınızı, şifrelerinizi ve notlarınızı yerel ve şifreli şekilde saklayabileceğiniz ücretsiz Windows masaüstü aracı.',
  heroImageUrl: '',
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return fallback
}

export function mergeSifreKasasiPageContent(
  partial?: Partial<SifreKasasiPageContent> | null,
): SifreKasasiPageContent {
  if (!partial) return { ...defaultSifreKasasiPageContent }

  return {
    enabled: parseBoolean(partial.enabled, defaultSifreKasasiPageContent.enabled),
    badge: partial.badge?.trim() || defaultSifreKasasiPageContent.badge,
    title: partial.title?.trim() || defaultSifreKasasiPageContent.title,
    subtitle: partial.subtitle?.trim() || defaultSifreKasasiPageContent.subtitle,
    description: partial.description?.trim() || defaultSifreKasasiPageContent.description,
    version: partial.version?.trim() || defaultSifreKasasiPageContent.version,
    platform: partial.platform?.trim() || defaultSifreKasasiPageContent.platform,
    setupButtonText: partial.setupButtonText?.trim() || defaultSifreKasasiPageContent.setupButtonText,
    portableButtonText:
      partial.portableButtonText?.trim() || defaultSifreKasasiPageContent.portableButtonText,
    trustNote: partial.trustNote?.trim() || defaultSifreKasasiPageContent.trustNote,
    statsTotalLabel: partial.statsTotalLabel?.trim() || defaultSifreKasasiPageContent.statsTotalLabel,
    statsSetupLabel: partial.statsSetupLabel?.trim() || defaultSifreKasasiPageContent.statsSetupLabel,
    statsPortableLabel:
      partial.statsPortableLabel?.trim() || defaultSifreKasasiPageContent.statsPortableLabel,
    statsFallbackText:
      partial.statsFallbackText?.trim() || defaultSifreKasasiPageContent.statsFallbackText,
    seoTitle: partial.seoTitle?.trim() || defaultSifreKasasiPageContent.seoTitle,
    seoDescription: partial.seoDescription?.trim() || defaultSifreKasasiPageContent.seoDescription,
    heroImageUrl: partial.heroImageUrl?.trim() || '',
  }
}

export function resolveSifreKasasiHeroImage(heroImageUrl?: string | null): string {
  if (heroImageUrl && isValidImageSrc(heroImageUrl)) {
    return resolveImageUrl(heroImageUrl)
  }
  return DEFAULT_SIFRE_KASASI_SCREENSHOT
}
