import type { FetchPageResult, PageApiResponse } from '../types/page-api'

const base = () => import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export async function fetchPublicPage(slug: string): Promise<FetchPageResult> {
  try {
    const res = await fetch(`${base()}/api/pages/${encodeURIComponent(slug)}`)
    const json = await res.json().catch(() => ({}))
    if (res.status === 404) return { status: 'not_found' }
    if (!res.ok) {
      return {
        status: 'error',
        message: typeof json.message === 'string' ? json.message : 'Sayfa yüklenemedi',
      }
    }
    if (!json.success || !json.data) {
      return { status: 'error', message: 'Geçersiz yanıt' }
    }
    return { status: 'ok', data: json.data as PageApiResponse }
  } catch {
    return { status: 'error', message: 'Bağlantı hatası' }
  }
}
