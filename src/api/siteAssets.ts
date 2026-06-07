import { buildApiUrl } from '../config/api'
import { adminFetch } from '../lib/adminAuth'

export type SiteAssetKind = 'logo' | 'favicon'

export async function uploadSiteAsset(
  file: File,
  kind: SiteAssetKind,
): Promise<{ path: string; message?: string }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('kind', kind)

  const response = await adminFetch(buildApiUrl('/admin/cms/site-assets/upload'), {
    method: 'POST',
    body: formData,
  })

  const data = (await response.json()) as {
    success?: boolean
    path?: string
    message?: string
  }

  if (!response.ok || !data.success || !data.path) {
    throw new Error(data.message || 'Dosya yüklenemedi')
  }

  return { path: data.path, message: data.message }
}
