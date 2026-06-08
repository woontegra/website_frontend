import { buildApiUrl } from '../config/api'
import { getAdminToken } from './cms'

export async function fetchPageContentBundle<T>(
  pageKey: string,
  defaults: T,
  merge: (defaults: T, partial?: Partial<T> | null) => T,
): Promise<T> {
  try {
    const response = await fetch(buildApiUrl(`/page-content/${pageKey}`), { cache: 'no-store' })
    if (!response.ok) return merge(defaults)
    const json = (await response.json()) as { success?: boolean; data?: Partial<T> }
    if (!json.success || !json.data) return merge(defaults)
    return merge(defaults, json.data)
  } catch {
    return merge(defaults)
  }
}

export async function savePageContentBundle<T>(
  pageKey: string,
  content: T,
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
