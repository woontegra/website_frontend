import { useEffect, useState } from 'react'
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

export function useMenuItems() {
  const [bundle, setBundle] = useState<MenuItemsBundle>(defaultMenuItemsBundle)
  const [loaded, setLoaded] = useState(false)

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

  const items = getActiveMenuItems(bundle)
  const headerButtons = getActiveHeaderButtons(bundle)

  return { items, headerButtons, loaded }
}

export type { MenuItemConfig }
