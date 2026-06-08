import { buildApiUrl } from '../config/api'
import { getAdminToken } from './cms'
import {
  LEGAL_COMPANY_PAGE_KEY,
  mergeLegalCompanyInfo,
  type LegalCompanyInfo,
} from '../data/legalCompanyInfo'

export async function fetchLegalCompanyInfo(): Promise<LegalCompanyInfo> {
  try {
    const response = await fetch(buildApiUrl(`/page-content/${LEGAL_COMPANY_PAGE_KEY}`), {
      cache: 'no-store',
    })
    if (!response.ok) return mergeLegalCompanyInfo()
    const json = (await response.json()) as { success?: boolean; data?: Partial<LegalCompanyInfo> }
    if (!json.success || !json.data) return mergeLegalCompanyInfo()
    return mergeLegalCompanyInfo(json.data)
  } catch {
    return mergeLegalCompanyInfo()
  }
}

export async function saveLegalCompanyInfo(
  content: LegalCompanyInfo,
): Promise<{ success: boolean; message?: string }> {
  const token = getAdminToken()
  try {
    const response = await fetch(buildApiUrl(`/page-content/${LEGAL_COMPANY_PAGE_KEY}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content: mergeLegalCompanyInfo(content) }),
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
