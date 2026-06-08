import { buildApiUrl } from '../config/api'
import { getAdminToken } from './cms'
import { mergeLegalPageContent, type LegalPageContent } from '../data/legalPageContent'

export async function fetchLegalPageContent(
  pageKey: string,
  defaults: LegalPageContent,
): Promise<LegalPageContent> {
  try {
    const response = await fetch(buildApiUrl(`/page-content/${pageKey}`), { cache: 'no-store' })
    if (!response.ok) return mergeLegalPageContent(defaults)
    const json = (await response.json()) as { success?: boolean; data?: Partial<LegalPageContent> }
    if (!json.success || !json.data) return mergeLegalPageContent(defaults)
    return mergeLegalPageContent(defaults, json.data)
  } catch {
    return mergeLegalPageContent(defaults)
  }
}

export async function saveLegalPageContent(
  pageKey: string,
  defaults: LegalPageContent,
  content: LegalPageContent,
): Promise<{ success: boolean; message?: string }> {
  const token = getAdminToken()
  try {
    const response = await fetch(buildApiUrl(`/page-content/${pageKey}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content: mergeLegalPageContent(defaults, content) }),
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
