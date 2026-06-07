import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  DEFAULT_SITE_FAVICON,
  DEFAULT_SITE_LOGO,
  fetchPublicSiteSettings,
  type PublicSiteSettings,
} from '../api/siteSettings'
import { resolveImageUrl } from '../lib/resolveImageUrl'

const defaultSettings: PublicSiteSettings = {
  siteName: 'Woontegra',
  contactEmail: 'info@woontegra.com',
  contactPhone: '',
  contactAddress: '',
  logo: DEFAULT_SITE_LOGO,
  favicon: DEFAULT_SITE_FAVICON,
  primaryColor: '#22c55e',
  secondaryColor: '#0ea5e9',
}

const SiteSettingsContext = createContext<PublicSiteSettings>(defaultSettings)

function faviconMimeType(path: string): string {
  const lower = path.toLowerCase()
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.ico')) return 'image/x-icon'
  return 'image/png'
}

function applyFavicon(path: string) {
  const href = resolveImageUrl(path)
  if (!href) return

  const mime = faviconMimeType(href)
  const selectors = ['link[rel="icon"]', 'link[rel="shortcut icon"]', 'link[rel="apple-touch-icon"]']

  for (const selector of selectors) {
    let link = document.querySelector<HTMLLinkElement>(selector)
    if (!link) {
      link = document.createElement('link')
      link.rel = selector.includes('apple') ? 'apple-touch-icon' : 'icon'
      document.head.appendChild(link)
    }
    link.type = mime
    link.href = href
  }
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSiteSettings>(defaultSettings)

  useEffect(() => {
    let cancelled = false
    void fetchPublicSiteSettings().then((data) => {
      if (!cancelled) setSettings(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    applyFavicon(settings.favicon)
  }, [settings.favicon])

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
