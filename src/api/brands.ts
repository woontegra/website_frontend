import { apiClient } from './client'

export type Brand = {
  id: string
  name: string
  description?: string
  image: string
  url?: string
  createdAt: string
  updatedAt: string
}

export const brandsApi = {
  async getAll() {
    const response = await apiClient.get<{ success: boolean; data: Brand[] }>('/brands')
    return response.data.data
  },

  async getById(id: string) {
    const response = await apiClient.get<{ success: boolean; data: Brand }>(`/brands/${id}`)
    return response.data.data
  },

  async create(data: { name: string; description?: string; image: string; url?: string }) {
    const response = await apiClient.post<{ success: boolean; data: Brand }>('/brands', data)
    return response.data.data
  },

  async update(id: string, data: { name?: string; description?: string; image?: string; url?: string }) {
    const response = await apiClient.put<{ success: boolean; data: Brand }>(`/brands/${id}`, data)
    return response.data.data
  },

  async delete(id: string) {
    await apiClient.delete(`/brands/${id}`)
  },
}
