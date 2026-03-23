export const apiBase = () => import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

/** /uploads/... veya tam URL → tarayıcıda kullanılabilir adres */
export function resolveMediaSrc(url: string): string {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `${apiBase()}${url.startsWith('/') ? url : `/${url}`}`
}

export function getAdminToken(): string | null {
  return localStorage.getItem('woontegra_token')
}

export async function adminApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getAdminToken()
  const res = await fetch(`${apiBase()}/api/admin/cms${path}`, {
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

/** POST /api/pages, PUT /api/pages/:id — WordPress-benzeri sayfa API */
export async function adminPagesWriteApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getAdminToken()
  const res = await fetch(`${apiBase()}/api/pages${path}`, {
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

export type MediaAssetRow = {
  id: string
  url: string
  filename: string
  mimeType: string | null
  size: number | null
  createdAt: string
}

export async function adminListMedia(): Promise<{ success: boolean; data?: MediaAssetRow[]; message?: string }> {
  return adminApi<MediaAssetRow[]>('/media')
}

export async function adminUploadMedia(
  file: File
): Promise<{ success: boolean; data?: MediaAssetRow; message?: string }> {
  const token = getAdminToken()
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${apiBase()}/api/admin/cms/media/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) return { success: false, message: json.message ?? 'Yükleme hatası' }
  return json
}
