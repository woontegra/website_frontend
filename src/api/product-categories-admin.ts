import { apiClient } from './client'

export type AdminProductCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type AdminProductCategoryInput = {
  name: string
  slug?: string
  description?: string
  parentId?: string | null
  isActive?: boolean
  sortOrder?: number
}

export const productCategoriesAdminApi = {
  async list(): Promise<AdminProductCategory[]> {
    const res = await apiClient.get<{ success: boolean; data: AdminProductCategory[] }>('/admin/product-categories')
    return res.data.data
  },

  async getById(id: string): Promise<AdminProductCategory> {
    const res = await apiClient.get<{ success: boolean; data: AdminProductCategory }>(`/admin/product-categories/${id}`)
    return res.data.data
  },

  async create(payload: AdminProductCategoryInput): Promise<AdminProductCategory> {
    const res = await apiClient.post<{ success: boolean; data: AdminProductCategory }>('/admin/product-categories', payload)
    return res.data.data
  },

  async update(id: string, payload: Partial<AdminProductCategoryInput>): Promise<AdminProductCategory> {
    const res = await apiClient.patch<{ success: boolean; data: AdminProductCategory }>(
      `/admin/product-categories/${id}`,
      payload,
    )
    return res.data.data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/admin/product-categories/${id}`)
  },
}
