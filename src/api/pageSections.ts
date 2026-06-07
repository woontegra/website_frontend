import { buildApiUrl } from '../config/api'
import { getAdminToken } from './cms'
import type { PageData } from '../types/sections'

function isPageData(value: unknown): value is PageData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'sections' in value &&
    Array.isArray((value as PageData).sections)
  )
}

/** Public — canlı site ve panel önizleme */
export async function fetchPageSections(pageKey: string): Promise<PageData | null> {
  try {
    const response = await fetch(buildApiUrl(`/page-content/${pageKey}`))
    if (!response.ok) return null
    const json = (await response.json()) as { success?: boolean; data?: unknown }
    if (!json.success || !json.data || !isPageData(json.data)) return null
    return json.data
  } catch {
    return null
  }
}

/** Admin — kalıcı kayıt (PostgreSQL pageContent) */
export async function savePageSections(
  pageKey: string,
  data: PageData
): Promise<{ success: boolean; message?: string }> {
  const token = getAdminToken()
  try {
    const response = await fetch(buildApiUrl(`/page-content/${pageKey}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content: data }),
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

/** Eski localStorage kayıtlarını bir kez oku (API boşsa migrasyon için) */
export function readLegacyPageSections(storageKey: string): PageData | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    return isPageData(parsed) ? parsed : null
  } catch {
    return null
  }
}
