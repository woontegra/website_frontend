import type { SubBrand } from '../types'
import { siteImages } from './siteImages'

export const subBrands: SubBrand[] = [
  {
    id: 'optimoon',
    name: 'Optimoon',
    description: 'Dijital ürünler, oyun ve yaratıcı teknoloji projeleri.',
    href: '/hizmetler/oyun-gelistirme',
    logo: siteImages.brandOptimoon,
  },
  {
    id: 'datca',
    name: 'Datça Tropikal',
    description: 'Doğal ve tropikal ürünler için e-ticaret markası.',
    href: '/cozumler/datca-topikal',
    logo: siteImages.brandDatca,
  },
  {
    id: 'mercan',
    name: 'Mercan Danışmanlık',
    description: 'Dijital dönüşüm ve teknoloji danışmanlığı.',
    href: '/hizmetler/dijital-danismanlik',
    logo: siteImages.brandMercan,
  },
  {
    id: 'bilirkisi',
    name: 'Bilirkişi Hesap',
    description: 'Bilirkişi raporları için hızlı ve güvenilir hesaplama yazılımı.',
    href: '/cozumler/bilirkisi-hesaplama',
    logo: siteImages.brandBilirkisi,
  },
]
