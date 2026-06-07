import { buildApiUrl } from '../config/api'
import { resolveImageUrl } from '../lib/resolveImageUrl'

/** @deprecated resolveImageUrl kullanın */
export function resolveMediaSrc(url: string): string {
  return resolveImageUrl(url)
}

export function getAdminToken(): string | null {
  return localStorage.getItem('woontegra_token')
}

export async function adminApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getAdminToken()
  const res = await fetch(buildApiUrl(`/admin/cms${path}`), {
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
  const res = await fetch(buildApiUrl(`/pages${path}`), {
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

/** Kurumsal site: yükleme devre dışı — public/images kullanın */
export async function adminUploadMedia(
  _file: File
): Promise<{ success: boolean; message?: string; code?: string }> {
  return {
    success: false,
    code: 'UPLOAD_DISABLED',
    message:
      'Bilgisayardan yükleme devre dışı. Panelden public/images listesinden görsel seçin (/images/... yolu).',
  }
}
