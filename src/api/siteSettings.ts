import { buildApiUrl } from '../config/api'

export type PublicSiteSettings = {
  siteName: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
}

export const DEFAULT_SITE_LOGO = '/logo.svg'
export const DEFAULT_SITE_FAVICON = '/favicon.svg'

export async function fetchPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    const response = await fetch(buildApiUrl('/settings'), { cache: 'no-store' })
    if (!response.ok) throw new Error('settings fetch failed')
    const data = (await response.json()) as Partial<PublicSiteSettings>
    return {
      siteName: data.siteName || 'Woontegra',
      contactEmail: data.contactEmail || 'info@woontegra.com',
      contactPhone: data.contactPhone || '',
      contactAddress: data.contactAddress || '',
      logo: data.logo?.trim() || DEFAULT_SITE_LOGO,
      favicon: data.favicon?.trim() || DEFAULT_SITE_FAVICON,
      primaryColor: data.primaryColor || '#22c55e',
      secondaryColor: data.secondaryColor || '#0ea5e9',
    }
  } catch {
    return {
      siteName: 'Woontegra',
      contactEmail: 'info@woontegra.com',
      contactPhone: '',
      contactAddress: '',
      logo: DEFAULT_SITE_LOGO,
      favicon: DEFAULT_SITE_FAVICON,
      primaryColor: '#22c55e',
      secondaryColor: '#0ea5e9',
    }
  }
}
