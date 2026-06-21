import { apiClient } from './client'

export type AdminLicenseRow = {
  id: string
  licenseKey: string
  customerName: string | null
  customerEmail: string
  customerPhone: string | null
  productName: string
  productCode: string | null
  source: 'MANUAL' | 'WEBSITE_ORDER'
  orderId: string | null
  orderNo: string | null
  status: 'ACTIVE' | 'DISABLED' | 'EXPIRED'
  maxDevices: number
  startsAt: string | null
  expiresAt: string | null
  notes: string | null
  activatedDevicesCount: number
  createdAt: string
  updatedAt: string
}

export type AdminLicenseDetail = AdminLicenseRow & {
  activations: {
    id: string
    deviceHash: string
    deviceName: string | null
    platform: string | null
    appVersion: string | null
    firstActivatedAt: string
    lastValidatedAt: string | null
    status: string
  }[]
}

export type AdminLicenseCreateBody = {
  customerName: string
  customerEmail: string
  customerPhone?: string
  productCode?: string
  startsAt?: string
  expiresAt: string
  maxDevices?: number
  notes?: string
  sendEmail?: boolean
}

export const licensesAdminApi = {
  async list(params?: {
    source?: string
    status?: string
    email?: string
    productCode?: string
    q?: string
  }): Promise<AdminLicenseRow[]> {
    const q = new URLSearchParams()
    if (params?.source) q.set('source', params.source)
    if (params?.status) q.set('status', params.status)
    if (params?.email) q.set('email', params.email)
    if (params?.productCode) q.set('productCode', params.productCode)
    if (params?.q) q.set('q', params.q)
    const suffix = q.toString() ? `?${q.toString()}` : ''
    const res = await apiClient.get<unknown>(`/admin/licenses${suffix}`)
    const out = res.data as { success?: boolean; data?: AdminLicenseRow[] }
    return out.data ?? []
  },

  async get(id: string): Promise<AdminLicenseDetail> {
    const res = await apiClient.get<unknown>(`/admin/licenses/${encodeURIComponent(id)}`)
    const out = res.data as { success?: boolean; data?: AdminLicenseDetail; message?: string }
    if (!out.data) throw new Error(out.message || 'Lisans bulunamadı')
    return out.data
  },

  async create(body: AdminLicenseCreateBody): Promise<{ license: AdminLicenseDetail; activationPassword: string }> {
    const res = await apiClient.post<unknown>('/admin/licenses', body)
    const out = res.data as {
      success?: boolean
      data?: AdminLicenseDetail
      activationPassword?: string
      message?: string
    }
    if (!out.data || !out.activationPassword) {
      throw new Error(out.message || 'Lisans oluşturulamadı')
    }
    return { license: out.data, activationPassword: out.activationPassword }
  },

  async patch(
    id: string,
    body: Partial<{
      status: 'ACTIVE' | 'DISABLED' | 'EXPIRED'
      maxDevices: number
      expiresAt: string
      notes: string | null
      customerName: string
      customerPhone: string | null
    }>,
  ): Promise<AdminLicenseDetail> {
    const res = await apiClient.patch<unknown>(`/admin/licenses/${encodeURIComponent(id)}`, body)
    const out = res.data as { success?: boolean; data?: AdminLicenseDetail; message?: string }
    if (!out.data) throw new Error(out.message || 'Güncellenemedi')
    return out.data
  },

  async extend(id: string, expiresAt: string): Promise<AdminLicenseDetail> {
    const res = await apiClient.post<unknown>(`/admin/licenses/${encodeURIComponent(id)}/extend`, { expiresAt })
    const out = res.data as { success?: boolean; data?: AdminLicenseDetail; message?: string }
    if (!out.data) throw new Error(out.message || 'Uzatılamadı')
    return out.data
  },

  async resetDevices(id: string): Promise<AdminLicenseDetail> {
    const res = await apiClient.post<unknown>(`/admin/licenses/${encodeURIComponent(id)}/reset-devices`, {})
    const out = res.data as { success?: boolean; data?: AdminLicenseDetail; message?: string }
    if (!out.data) throw new Error(out.message || 'Cihazlar sıfırlanamadı')
    return out.data
  },

  async regeneratePassword(
    id: string,
    sendEmail: boolean,
  ): Promise<{ license: AdminLicenseDetail; activationPassword: string }> {
    const res = await apiClient.post<unknown>(`/admin/licenses/${encodeURIComponent(id)}/regenerate-password`, {
      sendEmail,
    })
    const out = res.data as {
      success?: boolean
      data?: AdminLicenseDetail
      activationPassword?: string
      message?: string
    }
    if (!out.data || !out.activationPassword) {
      throw new Error(out.message || 'Şifre yenilenemedi')
    }
    return { license: out.data, activationPassword: out.activationPassword }
  },

  async sendEmail(id: string, activationPassword?: string): Promise<void> {
    const res = await apiClient.post<unknown>(`/admin/licenses/${encodeURIComponent(id)}/send-email`, {
      activationPassword,
    })
    const out = res.data as { success?: boolean; message?: string }
    if (!out.success) throw new Error(out.message || 'E-posta gönderilemedi')
  },
}
