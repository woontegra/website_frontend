import { useEffect, useMemo, useState } from 'react'
import { getApiUrl } from '../config/api'
import { fetchPageContentBundle } from '../api/pageContentBundle'
import {
  defaultMenuItemsBundle,
  getActiveHeaderButtons,
  getActiveMenuItems,
  MENU_ITEMS_KEY,
  mergeMenuItems,
  type MenuItemConfig,
  type MenuItemsBundle,
} from '../data/menuItemsContent'
import { softwareNavMenuItem } from '../data/softwareNavMenu'
import type { PublicNavMenuItem } from '../api/products-public'
import { menuPathForNav } from '../lib/menuPathForNav'

function apiRoot(): string {
  const base = getApiUrl()
  return base.endsWith('/api') ? base : `${base}/api`
}

function mapCatalogNavToMenuItems(tree: PublicNavMenuItem[], baseOrder: number): MenuItemConfig[] {
  const walk = (nodes: PublicNavMenuItem[], depth: number): MenuItemConfig[] =>
    nodes.map((node, i) => {
      const href = node.resolvedUrl || node.href
      return {
        id: `catalog-nav-${node.id}`,
        label: node.label,
        href: href && href !== '#' ? href : '/urunler',
        order: baseOrder + depth * 50 + i,
        enabled: href !== '#',
        openInNewTab: node.openInNewTab,
        isButton: false,
        children: node.children?.length ? walk(node.children, depth + 1) : undefined,
      }
    })
  return walk(tree, 0)
}

function normLabel(label: string): string {
  return label.trim().toLocaleLowerCase('tr-TR')
}

/** Header'dan kaldırılacak eski menü öğeleri (CMS/katalog kaynaklı dahil). */
function isHiddenHeaderNavItem(item: MenuItemConfig): boolean {
  if (item.id === 'tools' || item.id === 'desktop-store') return true
  const label = normLabel(item.label)
  if (label === 'ücretsiz araçlar' || label === 'masaüstü araçlar') return true
  const path = menuPathForNav(item.href)
  if (path === '/ucretsiz-araclar') return true
  if (path === '/urunler' && label.includes('masaüstü')) return true
  return false
}

function restoreDropdownChildren(items: MenuItemConfig[]): MenuItemConfig[] {
  const defaultsById = new Map<string, MenuItemConfig>()
  for (const item of defaultMenuItemsBundle.items) {
    if ((item.children?.length ?? 0) > 0) defaultsById.set(item.id, item)
  }
  defaultsById.set('software', softwareNavMenuItem)

  return items.map((item) => {
    const def = defaultsById.get(item.id)
    if (def?.children?.length && (!item.children || item.children.length === 0)) {
      return { ...item, children: def.children }
    }
    return item
  })
}

function applySoftwareNavMenu(items: MenuItemConfig[]): MenuItemConfig[] {
  const filtered = items.filter((i) => !isHiddenHeaderNavItem(i))
  const withChildren = restoreDropdownChildren(filtered)
  const withoutOldSoftware = withChildren.filter((i) => i.id !== 'software')
  return [...withoutOldSoftware, softwareNavMenuItem].sort((a, b) => a.order - b.order)
}

export function useMenuItems() {
  const [bundle, setBundle] = useState<MenuItemsBundle>(defaultMenuItemsBundle)
  const [loaded, setLoaded] = useState(false)
  const [catalogNav, setCatalogNav] = useState<MenuItemConfig[]>([])

  useEffect(() => {
    let cancelled = false
    void fetchPageContentBundle(MENU_ITEMS_KEY, defaultMenuItemsBundle, mergeMenuItems).then((data) => {
      if (!cancelled) {
        setBundle(data)
        setLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    void fetch(`${apiRoot()}/navigation-menu`)
      .then((r) => r.json())
      .then((json: { success?: boolean; data?: PublicNavMenuItem[] }) => {
        if (cancelled || !json?.success || !Array.isArray(json.data)) return
        setCatalogNav(mapCatalogNavToMenuItems(json.data, 45))
      })
      .catch(() => {
        if (!cancelled) setCatalogNav([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const items = useMemo(() => {
    const cmsRaw = getActiveMenuItems(bundle)
    const hasCatalogUrunler = catalogNav.some((c) => menuPathForNav(c.href) === '/urunler')
    const cmsItems = hasCatalogUrunler ? cmsRaw.filter((i) => i.id !== 'desktop-store') : cmsRaw
    const merged = [...cmsItems, ...catalogNav]
      .filter((i) => menuPathForNav(i.href) !== '/sss')
    return applySoftwareNavMenu(merged)
  }, [bundle, catalogNav])

  const headerButtons = getActiveHeaderButtons(bundle)

  return { items, headerButtons, loaded }
}

export type { MenuItemConfig }
