export const FOOTER_GROUPS_KEY = 'footerGroups'

export type FooterLinkConfig = {
  id: string
  label: string
  href?: string
  action?: 'cookie-preferences'
  order: number
  enabled: boolean
}

export type FooterGroupConfig = {
  id: string
  title: string
  order: number
  enabled: boolean
  links: FooterLinkConfig[]
}

export type FooterGroupsBundle = {
  groups: FooterGroupConfig[]
}

function normalizeLink(link: FooterLinkConfig, index: number): FooterLinkConfig {
  return {
    id: link.id || `link-${index}`,
    label: link.label?.trim() || 'Başlıksız',
    href: link.action ? undefined : link.href?.trim() || '/',
    action: link.action === 'cookie-preferences' ? 'cookie-preferences' : undefined,
    order: typeof link.order === 'number' ? link.order : index,
    enabled: link.enabled !== false,
  }
}

function normalizeGroup(group: FooterGroupConfig, index: number): FooterGroupConfig {
  return {
    id: group.id || `group-${index}`,
    title: group.title?.trim() || 'Grup',
    order: typeof group.order === 'number' ? group.order : index,
    enabled: group.enabled !== false,
    links: (group.links ?? []).map((link, li) => normalizeLink(link, li)),
  }
}

export function mergeFooterGroups(
  defaults: FooterGroupsBundle,
  partial?: Partial<FooterGroupsBundle> | null,
): FooterGroupsBundle {
  if (!partial) return { groups: defaults.groups.map((g, i) => normalizeGroup(g, i)) }
  const groups = (partial.groups ?? defaults.groups).map((group, i) => normalizeGroup(group, i))
  return { groups }
}

export const defaultFooterGroupsBundle: FooterGroupsBundle = {
  groups: [
    {
      id: 'hizmetler',
      title: 'Hizmetler',
      order: 0,
      enabled: true,
      links: [
        { id: 'f-sw', label: 'Yazılım Geliştirme', href: '/hizmetler/yazilim-gelistirme', order: 0, enabled: true },
        { id: 'f-web', label: 'Web Tasarım', href: '/hizmetler/web-tasarim', order: 1, enabled: true },
        { id: 'f-ecom', label: 'E-Ticaret', href: '/hizmetler/e-ticaret', order: 2, enabled: true },
        { id: 'f-tm', label: 'Marka & Patent', href: '/hizmetler/marka-patent-vekilligi', order: 3, enabled: true },
        { id: 'f-bil', label: 'Bilirkişi Hesaplama', href: '/cozumler/bilirkisi-hesaplama', order: 4, enabled: true },
      ],
    },
    {
      id: 'sirket',
      title: 'Şirket',
      order: 1,
      enabled: true,
      links: [
        { id: 'f-about', label: 'Hakkımızda', href: '/hakkimizda', order: 0, enabled: true },
        { id: 'f-sol', label: 'Çözümler', href: '/cozumler', order: 1, enabled: true },
        { id: 'f-blog', label: 'Blog', href: '/blog', order: 2, enabled: true },
        { id: 'f-contact', label: 'İletişim', href: '/iletisim', order: 3, enabled: true },
        { id: 'f-quote', label: 'Teklif Al', href: '/teklif-al', order: 4, enabled: true },
      ],
    },
    {
      id: 'yasal',
      title: 'Yasal',
      order: 2,
      enabled: true,
      links: [
        { id: 'f-kvkk', label: 'KVKK Aydınlatma Metni', href: '/kvkk-aydinlatma-metni', order: 0, enabled: true },
        { id: 'f-privacy', label: 'Gizlilik Politikası', href: '/gizlilik-politikasi', order: 1, enabled: true },
        { id: 'f-cookie', label: 'Çerez Politikası', href: '/cerez-politikasi', order: 2, enabled: true },
        { id: 'f-consent', label: 'Açık Rıza Metni', href: '/acik-riza-metni', order: 3, enabled: true },
        { id: 'f-terms', label: 'Kullanım Şartları', href: '/kullanim-sartlari', order: 4, enabled: true },
        { id: 'f-prefs', label: 'Çerez Tercihleri', action: 'cookie-preferences', order: 5, enabled: true },
      ],
    },
    {
      id: 'iletisim',
      title: 'İletişim',
      order: 3,
      enabled: true,
      links: [
        { id: 'f-mail', label: 'info@woontegra.com', href: 'mailto:info@woontegra.com', order: 0, enabled: true },
        { id: 'f-wa', label: 'WhatsApp', href: 'https://wa.me/90XXXXXXXXXX', order: 1, enabled: true },
      ],
    },
  ],
}

export function getActiveFooterGroups(bundle: FooterGroupsBundle): FooterGroupConfig[] {
  return bundle.groups
    .filter((group) => group.enabled)
    .sort((a, b) => a.order - b.order)
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.enabled).sort((a, b) => a.order - b.order),
    }))
    .filter((group) => group.links.length > 0)
}
