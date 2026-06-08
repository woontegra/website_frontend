import { buildApiUrl } from '../config/api'
import { getAdminToken } from './cms'
import {
  mergeSifreKasasiPageContent,
  SIFRE_KASASI_PAGE_KEY,
  type SifreKasasiPageContent,
} from '../data/sifreKasasiPage'

export async function fetchSifreKasasiPageContent(): Promise<SifreKasasiPageContent> {
  try {
    const response = await fetch(buildApiUrl(`/page-content/${SIFRE_KASASI_PAGE_KEY}`), {
      cache: 'no-store',
    })
    if (!response.ok) return mergeSifreKasasiPageContent()
    const json = (await response.json()) as { success?: boolean; data?: Partial<SifreKasasiPageContent> }
    if (!json.success || !json.data) return mergeSifreKasasiPageContent()
    return mergeSifreKasasiPageContent(json.data)
  } catch {
    return mergeSifreKasasiPageContent()
  }
}

export async function saveSifreKasasiPageContent(
  content: SifreKasasiPageContent,
): Promise<{ success: boolean; message?: string }> {
  const token = getAdminToken()
  try {
    const response = await fetch(buildApiUrl(`/page-content/${SIFRE_KASASI_PAGE_KEY}`), {
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
