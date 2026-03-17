import type { CmsPage } from '../types/cms'

const base = () => import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export async function fetchPageBySlug(slug: string): Promise<CmsPage | null> {
  const res = await fetch(`${base()}/api/pages/${encodeURIComponent(slug)}`)
  if (!res.ok) return null
  const json = await res.json()
  return json.data as CmsPage
}

export function getAdminToken(): string | null {
  return localStorage.getItem('woontegra_token')
}

export async function adminApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getAdminToken()
  const res = await fetch(`${base()}/api/admin/cms${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) return { success: false, message: json.message ?? 'Hata' }
  return json
}
