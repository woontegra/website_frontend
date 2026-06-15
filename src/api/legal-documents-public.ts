import axios from 'axios'
import { getApiUrl } from '../config/api'

const apiRoot = getApiUrl().endsWith('/api') ? getApiUrl() : `${getApiUrl()}/api`
const pub = axios.create({ baseURL: apiRoot })

export type LegalDocType =
  | 'PRE_INFORMATION'
  | 'DISTANCE_SALES'
  | 'KVKK_CLARIFICATION'
  | 'EXPLICIT_CONSENT'
  | 'COMMERCIAL_ELECTRONIC_MESSAGE'
  | 'TERMS_OF_USE'
  | 'PRIVACY_POLICY'

export const legalDocumentsPublicApi = {
  async getByType(type: LegalDocType): Promise<{ type: string; title: string; content: string; version: number }> {
    const res = await pub.get<{ success: boolean; data: { type: string; title: string; content: string; version: number } }>(
      `/legal-documents/${encodeURIComponent(type)}`,
    )
    return res.data.data
  },

  async preview(type: LegalDocType, variables: Record<string, string>): Promise<{ type: string; title: string; content: string; version: number }> {
    const res = await pub.post<{ success: boolean; data: { type: string; title: string; content: string; version: number } }>(
      `/legal-documents/preview`,
      { type, variables },
    )
    return res.data.data
  },
}
