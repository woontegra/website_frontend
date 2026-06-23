/** Woontegra kurumsal ana sayfa — tek sabit kaynak (API/CMS yok). */
export const homePageHero = {
  tag: 'Woontegra',
  title: 'Dijital Dünyada Gerçek Çözümler Üretiyoruz',
  subtitle:
    'Sadece yazılım geliştirmiyoruz, kendi ürünlerimizi yaratıyor ve yönetiyoruz. E-ticaret, SaaS, danışmanlık – hepsini deneyimliyoruz.',
  /** public/images/hero-dashboard.jpg */
  image: '/images/hero-dashboard.jpg',
} as const

export const homePageBrands = [
  {
    name: 'Bilirkişi',
    image: '/images/brand-bilirkisi.jpg',
    desc: 'Hukuk ve aktüerya alanında kullanılan profesyonel hesaplama yazılımıdır.',
    url: 'https://www.bilirkisihesap.com/',
  },
  {
    name: 'Optimoon',
    image: '/images/brand-optimoon.jpg',
    desc: 'Doğal taş ve özel tasarım ürünlerin yer aldığı e-ticaret markamızdır.',
    url: 'https://optimoon.com/',
  },
  {
    name: 'Datça Tropikal',
    image: '/images/brand-datca.jpg',
    desc: 'Yerel üretim ve doğal ürünlerin satışını gerçekleştiren markamızdır.',
    url: 'https://datcatropikal.com/',
  },
  {
    name: 'Mercan Danışmanlık',
    image: '/images/brand-mercan.jpg',
    desc: 'Marka tescil ve patent danışmanlık süreçlerini yöneten markamızdır.',
    url: 'https://mercandanismanlik.com/',
  },
] as const

export const STATIC_SITE_LOGO = '/logo.svg'
