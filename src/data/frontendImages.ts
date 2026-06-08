/**
 * Yalnızca projede gerçekten var olan ve geçerli formatlı dosyalar import edilir.
 * Stub .jpg dosyaları (data:image/svg+xml metin içeren) kullanılmaz.
 */
import heroDashboard from '../assets/images/hero-dashboard.jpg'
import aboutHeroImage from '../assets/images/about/hakkimizda-hero.jpg'
import yazilimHero from '../assets/images/services/yazilim-hero.png'
import webTasarimHero from '../assets/images/services/web-tasarim-hero.png'
import consultingHero from '../assets/images/services/danismanlik-hero.png'
import eTicaretHero from '../assets/images/e-ticaret.jpeg'
import brandBilirkisi from '../assets/brand/marka-bilirkisi.jpg'
import brandOptimoon from '../assets/brand/marka-optimoon.jpg'
import brandDatca from '../assets/brand/marka-datca.jpg'
import brandMercan from '../assets/brand/marka-mercan.jpg'
import woontegraSifreKasasiEkran from '../assets/images/woontegra-sifre-kasasi-ekran.png'
import servicesHero from '../assets/images/pages/services-hero.jpg'
import solutionsHero from '../assets/images/pages/solutions-hero.jpg'
import toolsHero from '../assets/images/pages/tools-hero.jpg'
import blogHero from '../assets/images/pages/blog-hero.jpg'
import contactHero from '../assets/images/pages/contact-hero.jpg'
import faqHero from '../assets/images/pages/faq-hero.jpg'
import ecommerceSystem from '../assets/images/solutions/ecommerce-system.jpg'

export const frontendImages = {
  homeHero: heroDashboard,
  softwareHero: yazilimHero,
  ecommerceHero: eTicaretHero,
  webDesignHero: webTasarimHero,
  aboutHero: aboutHeroImage,
  sifreKasasiScreenshot: woontegraSifreKasasiEkran,
  solutionsHero: solutionsHero,
  pages: {
    services: servicesHero,
    solutions: solutionsHero,
    tools: toolsHero,
    blog: blogHero,
    contact: contactHero,
    faq: faqHero,
  },
  solutions: {
    ecommerce: ecommerceSystem,
  },
  bilirkisiHesapHero: heroDashboard,
  optimoonProducts: brandOptimoon,
  datcaProducts: brandDatca,
  mercanServices: brandMercan,
  saasDashboard: woontegraSifreKasasiEkran,
  gameScene: heroDashboard,
  consultingDashboard: consultingHero,
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
