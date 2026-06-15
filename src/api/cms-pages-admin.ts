import { apiClient } from './client'

export type CmsPageListItem = {
  id: string
  slug: string
  title: string
  status: string
  createdAt: string
  updatedAt: string
}

export const cmsPagesAdminApi = {
  async list(): Promise<CmsPageListItem[]> {
    const res = await apiClient.get<{ success: boolean; data: CmsPageListItem[] }>('/admin/cms/pages')
    return res.data.data
  },
}
