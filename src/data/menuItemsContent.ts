export const MENU_ITEMS_KEY = 'menuItems'

export type MenuItemConfig = {
  id: string
  label: string
  href: string
  order: number
  enabled: boolean
  openInNewTab: boolean
  isButton: boolean
  children?: MenuItemConfig[]
}

export type MenuItemsBundle = {
  items: MenuItemConfig[]
  headerButtons: MenuItemConfig[]
}

function normalizeItem(item: MenuItemConfig, index: number): MenuItemConfig {
  return {
    id: item.id || `item-${index}`,
    label: item.label?.trim() || 'Başlıksız',
    href: item.href?.trim() || '/',
    order: typeof item.order === 'number' ? item.order : index,
    enabled: item.enabled !== false,
    openInNewTab: !!item.openInNewTab,
    isButton: !!item.isButton,
    children: item.children?.map((child, ci) => normalizeItem(child, ci)),
  }
}

export function mergeMenuItems(
  defaults: MenuItemsBundle,
  partial?: Partial<MenuItemsBundle> | null,
): MenuItemsBundle {
  if (!partial) return { ...defaults, items: [...defaults.items], headerButtons: [...defaults.headerButtons] }
  const items = (partial.items ?? defaults.items).map((item, i) => normalizeItem(item, i))
  const headerButtons = (partial.headerButtons ?? defaults.headerButtons).map((item, i) =>
    normalizeItem(item, i),
  )
  return { items, headerButtons }
}

export const defaultMenuItemsBundle: MenuItemsBundle = {
  items: [
    { id: 'home', label: 'Ana sayfa', href: '/', order: 0, enabled: true, openInNewTab: false, isButton: false },
    { id: 'about', label: 'Hakkımızda', href: '/hakkimizda', order: 1, enabled: true, openInNewTab: false, isButton: false },
    {
      id: 'services',
      label: 'Hizmetler',
      href: '/hizmetler',
      order: 2,
      enabled: true,
      openInNewTab: false,
      isButton: false,
      children: [
        { id: 'sw', label: 'Yazılım Geliştirme', href: '/hizmetler/yazilim-gelistirme', order: 0, enabled: true, openInNewTab: false, isButton: false },
        { id: 'web', label: 'Web Tasarım', href: '/hizmetler/web-tasarim', order: 1, enabled: true, openInNewTab: false, isButton: false },
        { id: 'ecom', label: 'E-Ticaret Çözümleri', href: '/hizmetler/e-ticaret', order: 2, enabled: true, openInNewTab: false, isButton: false },
        { id: 'saas', label: 'SaaS Ürün Geliştirme', href: '/hizmetler/saas', order: 3, enabled: true, openInNewTab: false, isButton: false },
        { id: 'tm', label: 'Marka & Patent Vekilliği', href: '/hizmetler/marka-patent-vekilligi', order: 4, enabled: true, openInNewTab: false, isButton: false },
        { id: 'game', label: 'Oyun Geliştirme', href: '/hizmetler/oyun-gelistirme', order: 5, enabled: true, openInNewTab: false, isButton: false },
        { id: 'consult', label: 'Dijital Danışmanlık', href: '/hizmetler/dijital-danismanlik', order: 6, enabled: true, openInNewTab: false, isButton: false },
      ],
    },
    { id: 'solutions', label: 'Çözümler', href: '/cozumler', order: 3, enabled: true, openInNewTab: false, isButton: false },
    { id: 'tools', label: 'Ücretsiz Araçlar', href: '/ucretsiz-araclar', order: 4, enabled: true, openInNewTab: false, isButton: false },
    { id: 'blog', label: 'Blog', href: '/blog', order: 5, enabled: true, openInNewTab: false, isButton: false },
    { id: 'faq', label: 'SSS', href: '/sss', order: 6, enabled: false, openInNewTab: false, isButton: false },
    { id: 'contact', label: 'İletişim', href: '/iletisim', order: 7, enabled: true, openInNewTab: false, isButton: false },
    {
      id: 'desktop-store',
      label: 'Masaüstü araçlar',
      href: '/urunler',
      order: 8,
      /** Varsayılan kapalı: /urunler linki menü yönetiminden (katalog) yönetilsin; pasif katalog öğesi header'da görünmesin. */
      enabled: false,
      openInNewTab: false,
      isButton: false,
    },
  ],
  headerButtons: [
    { id: 'quote', label: 'Teklif Al', href: '/teklif-al', order: 0, enabled: true, openInNewTab: false, isButton: true },
    { id: 'contact-btn', label: 'İletişim', href: '/iletisim', order: 1, enabled: true, openInNewTab: false, isButton: true },
  ],
}

export function getActiveMenuItems(bundle: MenuItemsBundle): MenuItemConfig[] {
  return bundle.items
    .filter((item) => item.enabled)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      children: item.children
        ?.filter((child) => child.enabled)
        .sort((a, b) => a.order - b.order),
    }))
}

export function getActiveHeaderButtons(bundle: MenuItemsBundle): MenuItemConfig[] {
  return bundle.headerButtons.filter((item) => item.enabled).sort((a, b) => a.order - b.order)
}
