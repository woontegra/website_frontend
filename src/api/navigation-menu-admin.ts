import { apiClient } from './client'

export type NavigationMenuItemType = 'CUSTOM_URL' | 'PRODUCT' | 'CATEGORY' | 'PAGE'

export type AdminNavigationMenuItem = {
  id: string
  label: string
  type: NavigationMenuItemType
  url: string | null
  productId: string | null
  categoryId: string | null
  pageId: string | null
  parentId: string | null
  sortOrder: number
  isActive: boolean
  openInNewTab: boolean
  createdAt: string
  updatedAt: string
  resolvedUrl: string
}

export type AdminNavigationMenuInput = {
  label: string
  type: NavigationMenuItemType
  url?: string | null
  productId?: string | null
  categoryId?: string | null
  pageId?: string | null
  parentId?: string | null
  sortOrder?: number
  isActive?: boolean
  openInNewTab?: boolean
}

export const navigationMenuAdminApi = {
  async list(): Promise<AdminNavigationMenuItem[]> {
    const res = await apiClient.get<{ success: boolean; data: AdminNavigationMenuItem[] }>('/admin/navigation-menu')
    return res.data.data
  },

  async getById(id: string): Promise<AdminNavigationMenuItem> {
    const res = await apiClient.get<{ success: boolean; data: AdminNavigationMenuItem }>(`/admin/navigation-menu/${id}`)
    return res.data.data
  },

  async create(payload: AdminNavigationMenuInput): Promise<AdminNavigationMenuItem> {
    const res = await apiClient.post<{ success: boolean; data: AdminNavigationMenuItem }>('/admin/navigation-menu', payload)
    return res.data.data
  },

  async update(id: string, payload: Partial<AdminNavigationMenuInput>): Promise<AdminNavigationMenuItem> {
    const res = await apiClient.patch<{ success: boolean; data: AdminNavigationMenuItem }>(
      `/admin/navigation-menu/${id}`,
      payload,
    )
    return res.data.data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/admin/navigation-menu/${id}`)
  },
}
