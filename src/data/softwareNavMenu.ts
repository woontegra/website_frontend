import type { MenuItemConfig } from './menuItemsContent'

/**
 * Ürün slug'ları — veritabanındaki Product.slug ile aynı olmalı (`/urun/${slug}`).
 * Lisans/backend kodundaki slug'lar (ör. muvekkil-kasa-defteri-desktop) farklı olabilir.
 */
export const SOFTWARE_PRODUCT_SLUGS = {
  mkDesktop: 'muvekkil-kasa-defteri-yazilimi',
  mkSaas: 'muvekkil-kasa-defteri-web-tabanli',
  isletmeDefteri: 'woontegra-isletme-defteri',
} as const

/** Ücretsiz araç — mağaza ürünü değil, mevcut tanıtım sayfası. */
export const SIFRE_KASASI_PAGE_PATH = '/ucretsiz-araclar/sifre-kasasi'

export function productDetailPath(slug: string): string {
  return `/urun/${slug}`
}

const navChild = (
  id: string,
  label: string,
  href: string,
  order: number,
  groupHeader = false,
): MenuItemConfig => ({
  id,
  label,
  href,
  order,
  enabled: true,
  openInNewTab: false,
  isButton: false,
  ...(groupHeader ? { groupHeader: true } : {}),
})

/** Header "Yazılımlar" dropdown — mevcut /urun/:slug detay sayfalarına bağlanır. */
export const softwareNavMenuItem: MenuItemConfig = {
  id: 'software',
  label: 'Yazılımlar',
  href: '#',
  order: 4,
  enabled: true,
  openInNewTab: false,
  isButton: false,
  children: [
    navChild('software-grp-hukuk', 'Hukuk Yazılımları', '#', 0, true),
    navChild(
      'sw-mk-desktop',
      'Müvekkil Kasa Defteri Masaüstü',
      productDetailPath(SOFTWARE_PRODUCT_SLUGS.mkDesktop),
      1,
    ),
    navChild(
      'sw-mk-saas',
      'Müvekkil Kasa Defteri Çoklu Kullanıcı',
      productDetailPath(SOFTWARE_PRODUCT_SLUGS.mkSaas),
      2,
    ),
    navChild('software-grp-isletme', 'İşletme Yazılımları', '#', 3, true),
    navChild(
      'sw-isletme',
      'Woontegra İşletme Defteri',
      productDetailPath(SOFTWARE_PRODUCT_SLUGS.isletmeDefteri),
      4,
    ),
    navChild('sw-sifre', 'Woontegra Şifre Kasası', SIFRE_KASASI_PAGE_PATH, 5),
  ],
}
