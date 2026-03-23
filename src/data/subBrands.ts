import type { SubBrand } from '../types'

/** Logo dosyalarını `frontend/public/brands/` içine PNG olarak ekleyin (aynı dosya adları). */
export const subBrands: SubBrand[] = [
  {
    id: 'optimoon',
    name: 'Optimoon',
    description: 'Dijital ürünler, oyun ve yaratıcı teknoloji projeleri.',
    href: '/hizmetler/oyun-gelistirme',
    logo: '/brands/optimoon.png',
  },
  {
    id: 'datca',
    name: 'Datça Tropikal',
    description: 'Doğal ve tropikal ürünler için e-ticaret markası.',
    href: '/cozumler/datca-topikal',
    logo: '/brands/datca.png',
  },
  {
    id: 'mercan',
    name: 'Mercan Danışmanlık',
    description: 'Dijital dönüşüm ve teknoloji danışmanlığı.',
    href: '/hizmetler/dijital-danismanlik',
    logo: '/brands/mercan.png',
  },
  {
    id: 'bilirkisi',
    name: 'Bilirkişi Hesap',
    description: 'Bilirkişi raporları için hızlı ve güvenilir hesaplama yazılımı.',
    href: '/cozumler/bilirkisi-hesaplama',
    logo: '/brands/bilirkisi.png',
  },
]
