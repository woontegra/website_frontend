import { apiClient } from './client'

export type AdminPaytrSettingsDto = {
  provider: string
  isActive: boolean
  testMode: boolean
  merchantId: string
  merchantKeyMasked: string
  merchantSaltMasked: string
  callbackUrl: string | null
  successUrl: string | null
  failUrl: string | null
  debugOn: boolean
  callbackPath: string
}

export type PatchPaytrBody = Partial<{
  isActive: boolean
  testMode: boolean
  debugOn: boolean
  merchantId: string
  merchantKey: string
  merchantSalt: string
  callbackUrl: string | null
  successUrl: string | null
  failUrl: string | null
}>

export const paymentSettingsAdminApi = {
  async getPaytr(): Promise<AdminPaytrSettingsDto> {
    const res = await apiClient.get<{ success: boolean; data: AdminPaytrSettingsDto }>('/admin/payment-settings/paytr')
    return res.data.data
  },

  async patchPaytr(body: PatchPaytrBody): Promise<AdminPaytrSettingsDto> {
    const res = await apiClient.patch<{ success: boolean; data: AdminPaytrSettingsDto }>(
      '/admin/payment-settings/paytr',
      body,
    )
    return res.data.data
  },
}
