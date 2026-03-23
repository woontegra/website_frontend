import { apiClient } from './client'

export type Service = {
  id: string
  title: string
  description: string
  icon: string
  createdAt: string
  updatedAt: string
}

export const servicesApi = {
  async getAll() {
    const response = await apiClient.get<{ success: boolean; data: Service[] }>('/services')
    return response.data.data
  },

  async getById(id: string) {
    const response = await apiClient.get<{ success: boolean; data: Service }>(`/services/${id}`)
    return response.data.data
  },

  async create(data: { title: string; description: string; icon: string }) {
    const response = await apiClient.post<{ success: boolean; data: Service }>('/services', data)
    return response.data.data
  },

  async update(id: string, data: { title?: string; description?: string; icon?: string }) {
    const response = await apiClient.put<{ success: boolean; data: Service }>(`/services/${id}`, data)
    return response.data.data
  },

  async delete(id: string) {
    await apiClient.delete(`/services/${id}`)
  },
}
