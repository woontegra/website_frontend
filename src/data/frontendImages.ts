/**
 * Yalnızca projede gerçekten var olan ve geçerli formatlı dosyalar import edilir.
 * Stub .jpg dosyaları (data:image/svg+xml metin içeren) kullanılmaz.
 */
export const PUBLIC_LOGO_SRC = '/logo.svg'

import heroDashboard from '../assets/images/hero-dashboard.jpg'
import eTicaretHero from '../assets/images/e-ticaret.jpeg'
import brandBilirkisi from '../assets/images/brand-bilirkisi.jpg'
import brandOptimoon from '../assets/images/brand-optimoon.jpg'
import brandDatca from '../assets/images/brand-datca.jpg'
import brandMercan from '../assets/images/brand-mercan.jpg'
import sifreKasasiEkran from '../assets/images/sifre-kasasi-ekran.png'

export const frontendImages = {
  logo: PUBLIC_LOGO_SRC,
  homeHero: heroDashboard,
  softwareHero: heroDashboard,
  ecommerceHero: eTicaretHero,
  webDesignHero: heroDashboard,
  aboutHero: heroDashboard,
  sifreKasasiScreenshot: sifreKasasiEkran,
  solutionsHero: heroDashboard,
  bilirkisiHesapHero: heroDashboard,
  optimoonProducts: brandOptimoon,
  datcaProducts: brandDatca,
  mercanServices: brandMercan,
  saasDashboard: heroDashboard,
  gameScene: heroDashboard,
  consultingDashboard: heroDashboard,
  trademarkDocument: heroDashboard,
  ctaBackground: heroDashboard,
  service1: heroDashboard,
  service2: heroDashboard,
  service3: heroDashboard,
  brands: {
    bilirkisi: brandBilirkisi,
    optimoon: brandOptimoon,
    datca: brandDatca,
    mercan: brandMercan,
  },
  blog: {
    digitalTransformation: heroDashboard,
    saasGuide: heroDashboard,
    ecommerceOptimization: eTicaretHero,
    trademark: heroDashboard,
    webTech: heroDashboard,
    digitalMarketing: heroDashboard,
    apiDesign: heroDashboard,
    default: heroDashboard,
  },
} as const

export const HEADER_LOGO_ALT = 'Woontegra'
export const HEADER_LOGO_WIDTH = 180
export const HEADER_LOGO_HEIGHT = 40

export const blogCoverBySlug: Record<string, string> = {
  'dijital-donusum-rehberi': frontendImages.blog.digitalTransformation,
  'saas-urun-gelistirme-rehberi': frontendImages.blog.saasGuide,
  'e-ticaret-optimizasyonu': frontendImages.blog.ecommerceOptimization,
  'marka-tescil-sureci': frontendImages.blog.trademark,
  'modern-web-teknolojileri': frontendImages.blog.webTech,
  'dijital-pazarlama-stratejileri': frontendImages.blog.digitalMarketing,
  'api-tasarimi-best-practices': frontendImages.blog.apiDesign,
}

export function getBlogCoverImage(slug: string): string {
  return blogCoverBySlug[slug] ?? frontendImages.blog.default
}
