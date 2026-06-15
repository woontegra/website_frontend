import axios from 'axios'
import { getApiUrl } from '../config/api'

const apiRoot = getApiUrl().endsWith('/api') ? getApiUrl() : `${getApiUrl()}/api`

const pub = axios.create({ baseURL: apiRoot })

export type BankTransferDisplayDto = {
  bankTransferEnabled: boolean
  configured: boolean
  bankName?: string
  branchName?: string
  accountNumber?: string
  accountHolder?: string
  iban?: string
  currency?: string
  referenceNote?: string
}

export const paymentsPublicApi = {
  async getBankTransferDisplay(): Promise<BankTransferDisplayDto> {
    const res = await pub.get<{ success: boolean; data: BankTransferDisplayDto }>('/payments/bank-transfer-display')
    return res.data.data
  },
}
