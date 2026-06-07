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
  const lower = path.toLowerCase().split('?')[0]
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.ico')) return 'image/x-icon'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  return 'image/png'
}

function applyFavicon(path: string) {
  const resolved = resolveImageUrl(path)
  if (!resolved) return

  const version = encodeURIComponent(path.trim())
  const href = `${resolved}${resolved.includes('?') ? '&' : '?'}v=${version}`
  const mime = faviconMimeType(path)

  document
    .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
    .forEach((node) => {
      if (!(node as HTMLLinkElement).id?.startsWith('woontegra-')) {
        node.remove()
      }
    })

  const upsert = (id: string, rel: string) => {
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = id
      document.head.appendChild(link)
    }
    link.rel = rel
    link.type = mime
    link.href = href
  }

  upsert('woontegra-favicon', 'icon')
  upsert('woontegra-apple-touch-icon', 'apple-touch-icon')
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
