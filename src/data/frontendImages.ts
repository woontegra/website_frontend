import woontegraLogo from '../assets/logos/woontegra-logo.svg'

import anaSayfaHero from '../assets/images/ana-sayfa-hero.jpg'
import yazilimDashboard from '../assets/images/yazilim-dashboard.jpg'
import eTicaretSistemi from '../assets/images/e-ticaret-sistemi.jpg'
import webTasarimMockup from '../assets/images/web-tasarim-mockup.jpg'
import hakkimizdaHero from '../assets/images/hakkimizda-hero.jpg'
import cozumlerSistem from '../assets/images/cozumler-sistem.jpg'
import bilirkisiHesapEkran from '../assets/images/bilirkisi-hesap-ekran.jpg'
import optimoonUrunler from '../assets/images/optimoon-urunler.jpg'
import datcaTropikalUrunler from '../assets/images/datca-tropikal-urunler.jpg'
import mercanDanismanlik from '../assets/images/mercan-danismanlik.jpg'
import saasDashboard from '../assets/images/saas-dashboard.jpg'
import oyunSahne from '../assets/images/oyun-sahne.jpg'
import dijitalDanismanlik from '../assets/images/dijital-danismanlik.jpg'
import markaPatentBelge from '../assets/images/marka-patent-belge.jpg'
import ctaBg from '../assets/images/cta-bg.jpg'
import sifreKasasiEkran from '../assets/images/sifre-kasasi-ekran.png'
import service1 from '../assets/images/service-1.jpg'
import service2 from '../assets/images/service-2.jpg'
import service3 from '../assets/images/service-3.jpeg'

import markaBilirkisi from '../assets/brand/marka-bilirkisi.jpg'
import markaOptimoon from '../assets/brand/marka-optimoon.jpg'
import markaDatca from '../assets/brand/marka-datca.jpg'
import markaMercan from '../assets/brand/marka-mercan.jpg'

import blogDijitalDonusum from '../assets/images/blog/dijital-donusum.jpg'
import blogSaasRehber from '../assets/images/blog/saas-rehber.jpg'
import blogEticaretOptimizasyon from '../assets/images/blog/e-ticaret-optimizasyon.jpg'
import blogMarkaTescil from '../assets/images/blog/marka-tescil.jpg'
import blogWebTeknolojileri from '../assets/images/blog/web-teknolojileri.jpg'
import blogDijitalPazarlama from '../assets/images/blog/dijital-pazarlama.jpg'
import blogApiTasarimi from '../assets/images/blog/api-tasarimi.jpg'
import blogVarsayilan from '../assets/images/blog/varsayilan.jpg'

export const frontendImages = {
  logo: woontegraLogo,
  homeHero: anaSayfaHero,
  softwareHero: yazilimDashboard,
  ecommerceHero: eTicaretSistemi,
  webDesignHero: webTasarimMockup,
  aboutHero: hakkimizdaHero,
  sifreKasasiScreenshot: sifreKasasiEkran,
  solutionsHero: cozumlerSistem,
  bilirkisiHesapHero: bilirkisiHesapEkran,
  optimoonProducts: optimoonUrunler,
  datcaProducts: datcaTropikalUrunler,
  mercanServices: mercanDanismanlik,
  saasDashboard,
  gameScene: oyunSahne,
  consultingDashboard: dijitalDanismanlik,
  trademarkDocument: markaPatentBelge,
  ctaBackground: ctaBg,
  service1,
  service2,
  service3,
  brands: {
    bilirkisi: markaBilirkisi,
    optimoon: markaOptimoon,
    datca: markaDatca,
    mercan: markaMercan,
  },
  blog: {
    digitalTransformation: blogDijitalDonusum,
    saasGuide: blogSaasRehber,
    ecommerceOptimization: blogEticaretOptimizasyon,
    trademark: blogMarkaTescil,
    webTech: blogWebTeknolojileri,
    digitalMarketing: blogDijitalPazarlama,
    apiDesign: blogApiTasarimi,
    default: blogVarsayilan,
  },
} as const

export const HEADER_LOGO_ALT = 'Woontegra'
export const HEADER_LOGO_WIDTH = 180
export const HEADER_LOGO_HEIGHT = 40

/** Blog yazısı slug → bundle görseli */
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
