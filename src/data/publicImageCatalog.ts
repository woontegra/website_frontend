/**
 * Kurumsal site — frontend/public/images medya kataloğu.
 * Panelde görsel galeri seçici bu listeyi kullanır.
 */

export type PublicImageCategory =
  | 'hero'
  | 'about'
  | 'services'
  | 'solutions'
  | 'blog'
  | 'tools'
  | 'brand'

export type PublicImageItem = {
  title: string
  path: string
  category: PublicImageCategory
  alt: string
}

export type PublicImageCategoryFilter = PublicImageCategory | 'all'

export const PUBLIC_IMAGE_CATEGORY_LABELS: Record<PublicImageCategoryFilter, string> = {
  all: 'Tümü',
  hero: 'Hero',
  about: 'Hakkımızda',
  services: 'Hizmetler',
  solutions: 'Çözümler',
  blog: 'Blog',
  tools: 'Araçlar',
  brand: 'Marka',
}

export const PUBLIC_IMAGE_CATEGORIES: PublicImageCategoryFilter[] = [
  'all',
  'hero',
  'about',
  'services',
  'solutions',
  'blog',
  'tools',
  'brand',
]

export const PUBLIC_IMAGE_CATALOG: PublicImageItem[] = [
  // Hero
  { title: 'Ana sayfa dashboard', path: '/images/hero-dashboard.jpg', category: 'hero', alt: 'Woontegra ana sayfa dashboard görseli' },
  { title: 'Ana sayfa hero', path: '/images/ana-sayfa-hero.jpg', category: 'hero', alt: 'Woontegra ana sayfa hero görseli' },
  { title: 'Yazılım sayfası hero', path: '/images/yazilim.png', category: 'hero', alt: 'Yazılım geliştirme sayfası hero görseli' },
  { title: 'Yazılım dashboard', path: '/images/yazilim-dashboard.jpg', category: 'hero', alt: 'Yazılım dashboard ekran görüntüsü' },
  { title: 'Web tasarım hero', path: '/images/web-tasarim.png', category: 'hero', alt: 'Web tasarım sayfası hero görseli' },
  { title: 'Web tasarım mockup', path: '/images/web-tasarim-mockup.jpg', category: 'hero', alt: 'Web tasarım mockup görseli' },
  { title: 'E-ticaret hero', path: '/images/e-ticaret.jpeg', category: 'hero', alt: 'E-ticaret sayfası hero görseli' },
  { title: 'E-ticaret sistemi', path: '/images/e-ticaret-sistemi.jpg', category: 'hero', alt: 'E-ticaret sistemi görseli' },
  { title: 'Dijital danışmanlık hero', path: '/images/dijital-danismanlik.jpg', category: 'hero', alt: 'Dijital danışmanlık sayfası hero görseli' },
  { title: 'SaaS dashboard', path: '/images/saas-dashboard.jpg', category: 'hero', alt: 'SaaS ürün dashboard görseli' },
  { title: 'Marka & patent hero', path: '/images/marka-patent-belge.jpg', category: 'hero', alt: 'Marka ve patent sayfası hero görseli' },
  { title: 'Oyun geliştirme hero', path: '/images/oyun-sahne.jpg', category: 'hero', alt: 'Oyun geliştirme sayfası hero görseli' },

  // Hakkımızda
  { title: 'Hakkımızda hero', path: '/images/about-hero.png', category: 'about', alt: 'Hakkımızda sayfası hero görseli' },
  { title: 'Hakkımızda alternatif hero', path: '/images/hakkimizda-hero.jpg', category: 'about', alt: 'Hakkımızda alternatif hero görseli' },

  // Hizmetler
  { title: 'Hizmet kartı 1', path: '/images/service-1.jpg', category: 'services', alt: 'Hizmetler bölümü görsel 1' },
  { title: 'Hizmet kartı 2', path: '/images/service-2.jpg', category: 'services', alt: 'Hizmetler bölümü görsel 2' },
  { title: 'Hizmet kartı 3', path: '/images/service-3.jpg', category: 'services', alt: 'Hizmetler bölümü görsel 3' },

  // Çözümler
  { title: 'Çözümler sistemi', path: '/images/cozumler-sistem.jpg', category: 'solutions', alt: 'Çözümler sayfası sistem görseli' },
  { title: 'Bilirkişi hesap ekranı', path: '/images/bilirkisi-hesap-ekran.jpg', category: 'solutions', alt: 'Bilirkişi hesaplama programı ekran görüntüsü' },
  { title: 'Optimoon ürünler', path: '/images/optimoon-urunler.jpg', category: 'solutions', alt: 'Optimoon e-ticaret ürün görseli' },
  { title: 'Datça Tropikal ürünler', path: '/images/datca-tropikal-urunler.jpg', category: 'solutions', alt: 'Datça Tropikal ürün görseli' },
  { title: 'Mercan danışmanlık', path: '/images/mercan-danismanlik.jpg', category: 'solutions', alt: 'Mercan danışmanlık hizmet görseli' },

  // Blog
  { title: 'Blog varsayılan kapak', path: '/images/blog/varsayilan.jpg', category: 'blog', alt: 'Blog yazısı varsayılan kapak görseli' },
  { title: 'Dijital dönüşüm', path: '/images/blog/dijital-donusum.jpg', category: 'blog', alt: 'Dijital dönüşüm blog kapak görseli' },
  { title: 'SaaS rehber', path: '/images/blog/saas-rehber.jpg', category: 'blog', alt: 'SaaS rehber blog kapak görseli' },
  { title: 'E-ticaret optimizasyon', path: '/images/blog/e-ticaret-optimizasyon.jpg', category: 'blog', alt: 'E-ticaret optimizasyon blog kapak görseli' },
  { title: 'Marka tescil', path: '/images/blog/marka-tescil.jpg', category: 'blog', alt: 'Marka tescil blog kapak görseli' },
  { title: 'Web teknolojileri', path: '/images/blog/web-teknolojileri.jpg', category: 'blog', alt: 'Web teknolojileri blog kapak görseli' },
  { title: 'Dijital pazarlama', path: '/images/blog/dijital-pazarlama.jpg', category: 'blog', alt: 'Dijital pazarlama blog kapak görseli' },
  { title: 'API tasarımı', path: '/images/blog/api-tasarimi.jpg', category: 'blog', alt: 'API tasarımı blog kapak görseli' },

  // Araçlar
  { title: 'Şifre kasası ekranı', path: '/images/woontegra-sifre-kasasi-ekran.png', category: 'tools', alt: 'Woontegra şifre kasası uygulama ekranı' },
  { title: 'CTA arka plan', path: '/images/cta-bg.jpg', category: 'tools', alt: 'Çağrı bölümü arka plan görseli' },

  // Marka
  { title: 'Site logosu (SVG)', path: '/logo.svg', category: 'brand', alt: 'Woontegra site logosu' },
  { title: 'Site favicon (SVG)', path: '/favicon.svg', category: 'brand', alt: 'Woontegra favicon' },
  { title: 'Marka — Bilirkişi', path: '/images/brand-bilirkisi.jpg', category: 'brand', alt: 'Bilirkişi marka logosu veya görseli' },
  { title: 'Marka — Optimoon', path: '/images/brand-optimoon.jpg', category: 'brand', alt: 'Optimoon marka görseli' },
  { title: 'Marka — Datça', path: '/images/brand-datca.jpg', category: 'brand', alt: 'Datça Tropikal marka görseli' },
  { title: 'Marka — Mercan', path: '/images/brand-mercan.jpg', category: 'brand', alt: 'Mercan danışmanlık marka görseli' },
  { title: 'Marka kartı — Bilirkişi', path: '/images/brand-bilirkisi.jpg', category: 'brand', alt: 'Bilirkişi marka kartı görseli' },
  { title: 'Marka kartı — Optimoon', path: '/images/brand-optimoon.jpg', category: 'brand', alt: 'Optimoon marka kartı görseli' },
  { title: 'Marka kartı — Datça', path: '/images/brand-datca.jpg', category: 'brand', alt: 'Datça marka kartı görseli' },
  { title: 'Marka kartı — Mercan', path: '/images/brand-mercan.jpg', category: 'brand', alt: 'Mercan marka kartı görseli' },
]

const catalogByPath = new Map(PUBLIC_IMAGE_CATALOG.map((item) => [item.path, item]))

export function findPublicImageByPath(path: string): PublicImageItem | undefined {
  return catalogByPath.get(path.trim())
}

export function getFilenameFromPath(imagePath: string): string {
  return imagePath.split('/').filter(Boolean).pop() ?? imagePath
}

export function filterPublicImages(
  items: PublicImageItem[],
  query: string,
  category: PublicImageCategoryFilter,
): PublicImageItem[] {
  const q = query.trim().toLowerCase()
  return items.filter((item) => {
    if (category !== 'all' && item.category !== category) return false
    if (!q) return true
    const filename = getFilenameFromPath(item.path).toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.alt.toLowerCase().includes(q) ||
      item.path.toLowerCase().includes(q) ||
      filename.includes(q)
    )
  })
}
