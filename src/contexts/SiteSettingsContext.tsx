import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  DEFAULT_SITE_FAVICON,
  DEFAULT_SITE_LOGO,
  fetchPublicSiteSettings,
  type PublicSiteSettings,
} from '../api/siteSettings'
import {
  DEFAULT_FOOTER_LOGO_HEIGHT,
  DEFAULT_MOBILE_LOGO_HEIGHT,
  DEFAULT_NAVBAR_LOGO_HEIGHT,
} from '../lib/logoSize'
import { isValidImageSrc, resolveImageUrl } from '../lib/resolveImageUrl'

export type SiteSettingsState = PublicSiteSettings & {
  loaded: boolean
}

const defaultSettings: SiteSettingsState = {
  siteName: 'Woontegra',
  contactEmail: 'info@woontegra.com',
  contactPhone: '',
  contactAddress: '',
  logo: '',
  logoUpdatedAt: '',
  navbarLogoHeight: DEFAULT_NAVBAR_LOGO_HEIGHT,
  footerLogoHeight: DEFAULT_FOOTER_LOGO_HEIGHT,
  mobileLogoHeight: DEFAULT_MOBILE_LOGO_HEIGHT,
  favicon: '',
  primaryColor: '#22c55e',
  secondaryColor: '#0ea5e9',
  loaded: false,
}

const SiteSettingsContext = createContext<SiteSettingsState>(defaultSettings)

function faviconMimeType(path: string): string {
  const lower = path.toLowerCase().split('?')[0]
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.ico')) return 'image/x-icon'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  return 'image/png'
}

function applyFavicon(path: string) {
  if (!isValidImageSrc(path)) return

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
  const [settings, setSettings] = useState<SiteSettingsState>(defaultSettings)

  useEffect(() => {
    let cancelled = false
    void fetchPublicSiteSettings().then((data) => {
      if (cancelled) return
      setSettings({
        ...data,
        logo: data.logo?.trim() || DEFAULT_SITE_LOGO,
        logoUpdatedAt: data.logoUpdatedAt?.trim() || '',
        favicon: data.favicon?.trim() || DEFAULT_SITE_FAVICON,
        loaded: true,
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!settings.loaded) return
    applyFavicon(settings.favicon)
  }, [settings.favicon, settings.loaded])

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
