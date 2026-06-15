import { apiClient } from './client'

export type LegalDocumentType =
  | 'PRE_INFORMATION'
  | 'DISTANCE_SALES'
  | 'KVKK_CLARIFICATION'
  | 'EXPLICIT_CONSENT'
  | 'COMMERCIAL_ELECTRONIC_MESSAGE'
  | 'TERMS_OF_USE'
  | 'PRIVACY_POLICY'

export type LegalDocumentAdminRow = {
  id: string
  type: LegalDocumentType
  title: string
  content: string
  version: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const legalDocumentsAdminApi = {
  async list(): Promise<LegalDocumentAdminRow[]> {
    const res = await apiClient.get<{ success: boolean; data: LegalDocumentAdminRow[] }>('/admin/legal-documents')
    return res.data.data
  },

  async getById(id: string): Promise<LegalDocumentAdminRow> {
    const res = await apiClient.get<{ success: boolean; data: LegalDocumentAdminRow }>(`/admin/legal-documents/${id}`)
    return res.data.data
  },

  async create(body: {
    type: LegalDocumentType
    title: string
    content: string
    version?: number
    isActive?: boolean
  }): Promise<LegalDocumentAdminRow> {
    const res = await apiClient.post<{ success: boolean; data: LegalDocumentAdminRow }>('/admin/legal-documents', body)
    return res.data.data
  },

  async patch(
    id: string,
    body: Partial<{ title: string; content: string; version: number; isActive: boolean }>,
  ): Promise<LegalDocumentAdminRow> {
    const res = await apiClient.patch<{ success: boolean; data: LegalDocumentAdminRow }>(
      `/admin/legal-documents/${id}`,
      body,
    )
    return res.data.data
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.delete(`/admin/legal-documents/${id}`)
  },
}
