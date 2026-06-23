import type { NavLink } from '../types'
import {
  productDetailPath,
  SIFRE_KASASI_PAGE_PATH,
  SOFTWARE_PRODUCT_SLUGS,
} from './softwareNavMenu'

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
  {
    label: 'Yazılımlar',
    href: '#',
    children: [
      { label: 'Hukuk Yazılımları', href: '#' },
      { label: 'Müvekkil Kasa Defteri Masaüstü', href: productDetailPath(SOFTWARE_PRODUCT_SLUGS.mkDesktop) },
      { label: 'Müvekkil Kasa Defteri Çoklu Kullanıcı', href: productDetailPath(SOFTWARE_PRODUCT_SLUGS.mkSaas) },
      { label: 'İşletme Yazılımları', href: '#' },
      { label: 'Woontegra İşletme Defteri', href: productDetailPath(SOFTWARE_PRODUCT_SLUGS.isletmeDefteri) },
      { label: 'Woontegra Şifre Kasası', href: SIFRE_KASASI_PAGE_PATH },
    ],
  },
  { label: 'Blog', href: '/blog' },
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
    { label: 'KVKK Aydınlatma Metni', href: '/kvkk-aydinlatma-metni' },
    { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
    { label: 'Çerez Politikası', href: '/cerez-politikasi' },
    { label: 'Açık Rıza Metni', href: '/acik-riza-metni' },
    { label: 'Kullanım Şartları', href: '/kullanim-sartlari' },
    { label: 'Çerez Tercihleri', action: 'cookie-preferences' as const },
  ],
}

export type FooterLink =
  | { label: string; href: string; action?: undefined }
  | { label: string; action: 'cookie-preferences'; href?: undefined }
