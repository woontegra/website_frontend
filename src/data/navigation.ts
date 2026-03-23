import type { NavLink } from '../types'

export const mainNav: NavLink[] = [
  { label: 'Ana sayfa', href: '/' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  {
    label: 'Hizmetler',
    href: '/hizmetler',
    children: [
      { label: 'Yazılım Geliştirme', href: '/hizmetler/yazilim-gelistirme' },
      { label: 'Web Tasarım', href: '/hizmetler/web-tasarim' },
      { label: 'E-Ticaret Çözümleri', href: '/hizmetler/e-ticaret' },
      { label: 'SaaS Ürün Geliştirme', href: '/hizmetler/saas' },
      { label: 'Marka & Patent Vekilliği', href: '/hizmetler/marka-patent-vekilligi' },
      { label: 'Oyun Geliştirme', href: '/hizmetler/oyun-gelistirme' },
      { label: 'Dijital Danışmanlık', href: '/hizmetler/dijital-danismanlik' },
    ],
  },
  { label: 'Çözümler', href: '/cozumler' },
  { label: 'Blog', href: '/blog' },
  { label: 'SSS', href: '/sss' },
  { label: 'İletişim', href: '/iletisim' },
]

export const footerNav = {
  hizmetler: [
    { label: 'Yazılım Geliştirme', href: '/hizmetler/yazilim-gelistirme' },
    { label: 'Web Tasarım', href: '/hizmetler/web-tasarim' },
    { label: 'E-Ticaret', href: '/hizmetler/e-ticaret' },
    { label: 'Marka & Patent', href: '/hizmetler/marka-patent-vekilligi' },
    { label: 'Bilirkişi Hesaplama', href: '/cozumler/bilirkisi-hesaplama' },
  ],
  sirket: [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'Çözümler', href: '/cozumler' },
    { label: 'Blog', href: '/blog' },
    { label: 'İletişim', href: '/iletisim' },
    { label: 'Teklif Al', href: '/teklif-al' },
  ],
  yasal: [
    { label: 'KVKK', href: '/kvkk' },
    { label: 'Gizlilik Politikası', href: '/gizlilik' },
    { label: 'Çerez Politikası', href: '/cerez-politikasi' },
    { label: 'Kullanım Şartları', href: '/kullanim-sartlari' },
  ],
}
