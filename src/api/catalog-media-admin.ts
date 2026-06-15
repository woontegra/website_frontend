import axios from 'axios'
import { getApiUrl } from '../config/api'
import { getAdminToken } from '../lib/adminAuth'
import { apiClient } from './client'

export type CatalogMediaFileType = 'IMAGE' | 'DOWNLOAD' | 'DOCUMENT'

export type CatalogMedia = {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  fileType: CatalogMediaFileType
  fileSize: number
  url: string
  storageKey: string | null
  createdAt: string
  updatedAt: string
}

function apiRoot(): string {
  const base = getApiUrl()
  return base.endsWith('/api') ? base : `${base}/api`
}

export const catalogMediaAdminApi = {
  async list(fileType?: CatalogMediaFileType): Promise<CatalogMedia[]> {
    const res = await apiClient.get<{ success: boolean; data: CatalogMedia[] }>('/admin/media', {
      params: fileType ? { fileType } : undefined,
    })
    return res.data.data
  },

  async upload(file: File): Promise<CatalogMedia> {
    const form = new FormData()
    form.append('file', file)
    const token = getAdminToken()
    const res = await axios.post<{ success: boolean; data: CatalogMedia }>(`${apiRoot()}/admin/media/upload`, form, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return res.data.data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/admin/media/${id}`)
  },
}
