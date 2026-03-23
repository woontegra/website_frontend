import { apiClient } from './client'

export type ContactMessage = {
  id: string
  name: string
  email: string
  message: string
  phone?: string
  company?: string
  read: boolean
  createdAt: string
}

export const contactMessagesApi = {
  async getAll() {
    const response = await apiClient.get<{ success: boolean; data: ContactMessage[] }>('/contact-messages')
    return response.data.data
  },

  async getById(id: string) {
    const response = await apiClient.get<{ success: boolean; data: ContactMessage }>(`/contact-messages/${id}`)
    return response.data.data
  },

  async create(data: { name: string; email: string; message: string; phone?: string; company?: string }) {
    const response = await apiClient.post<{ success: boolean; data: ContactMessage }>('/contact-messages', data)
    return response.data.data
  },

  async markAsRead(id: string) {
    const response = await apiClient.patch<{ success: boolean; data: ContactMessage }>(`/contact-messages/${id}/read`)
    return response.data.data
  },

  async delete(id: string) {
    await apiClient.delete(`/contact-messages/${id}`)
  },
}
