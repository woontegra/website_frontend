import { buildApiUrl } from '../config/api'
import { getAdminToken } from './cms'
import { mergeMarketingPageContent, type MarketingPageContent } from '../data/marketingPageContent'

export async function fetchMarketingPageContent(
  pageKey: string,
  defaults: MarketingPageContent,
): Promise<MarketingPageContent> {
  try {
    const response = await fetch(buildApiUrl(`/page-content/${pageKey}`), { cache: 'no-store' })
    if (!response.ok) return mergeMarketingPageContent(defaults)
    const json = (await response.json()) as { success?: boolean; data?: Partial<MarketingPageContent> }
    if (!json.success || !json.data) return mergeMarketingPageContent(defaults)
    return mergeMarketingPageContent(defaults, json.data)
  } catch {
    return mergeMarketingPageContent(defaults)
  }
}

export async function saveMarketingPageContent(
  pageKey: string,
  content: MarketingPageContent,
): Promise<{ success: boolean; message?: string }> {
  const token = getAdminToken()
  try {
    const response = await fetch(buildApiUrl(`/page-content/${pageKey}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content }),
    })
    const json = (await response.json()) as { success?: boolean; message?: string }
    if (!response.ok || !json.success) {
      return { success: false, message: json.message ?? 'Kayıt başarısız' }
    }
    return { success: true }
  } catch {
    return { success: false, message: 'Bağlantı hatası' }
  }
}
