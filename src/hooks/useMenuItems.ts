import { useEffect, useState } from 'react'
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

  const cmsRaw = getActiveMenuItems(bundle)
  const hasCatalogUrunler = catalogNav.some((c) => menuPathForNav(c.href) === '/urunler')
  /** Katalogda /urunler varsa CMS'deki desktop-store gizlenir (aynı path için tek kaynak: menü yönetimi). */
  const cmsItems = hasCatalogUrunler ? cmsRaw.filter((i) => i.id !== 'desktop-store') : cmsRaw
  /** Üst menüde SSS (/sss) gösterilmez; sayfa doğrudan URL ile açılabilir. */
  const items = [...cmsItems, ...catalogNav]
    .filter((i) => menuPathForNav(i.href) !== '/sss')
    .sort((a, b) => a.order - b.order)
  const headerButtons = getActiveHeaderButtons(bundle)

  return { items, headerButtons, loaded }
}

export type { MenuItemConfig }
