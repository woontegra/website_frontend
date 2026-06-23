import { apiClient } from './client'

export type AdminOrderListRow = {
  id: string
  orderNo: string
  customerName: string
  customerEmail: string
  productSummary: string
  itemCount: number
  total: number
  currency: string
  status: string
  paymentProvider: string
  paymentMethod?: string
  paymentStatus: string | null
  paytrTransactionStatus?: string | null
  /** En az bir PayTR PaymentTransaction satırı var mı (Havale siparişlerinde false) */
  hasPaytrTransactionRecord?: boolean
  adminNote?: string | null
  shippingCarrier?: string | null
  shippingTrackingNumber?: string | null
  shippingStatus?: string | null
  paidAt?: string | null
  paymentConfirmedAt?: string | null
  createdAt: string
}

export type AdminOrderListParams = {
  status?: string
  email?: string
  orderNo?: string
  customerQuery?: string
  paymentProvider?: string
  paymentStatus?: string
  dateFrom?: string
  dateTo?: string
}

export type AdminOrderLegalSnapshot = {
  id: string
  documentType: string
  title: string
  content: string
  version: number
  acceptedAt: string
  ipAddress: string | null
  userAgent: string | null
}

export type AdminOrderLegalArchiveFile = {
  id: string
  packageNo: string
  documentType: string | null
  fileCategory: string
  title: string
  fileName: string
  mimeType: string
  size: number
  sha256: string
  acceptanceCode: string | null
  version: number | null
  generatedAt: string
}

export type AdminOrderDetail = {
  id: string
  orderNo: string
  status: string
  orderStatusLabel?: string
  paymentProvider: string
  paymentMethod?: string
  paymentStatus?: string | null
  paymentStatusLabel?: string
  paytrTransactionStatus?: string | null
  subtotal: number
  total: number
  currency: string
  paidAt: string | null
  bankTransferPaymentDate: string | null
  bankTransferAdminNote: string | null
  bankTransferReference: string | null
  paymentConfirmedAt: string | null
  paymentConfirmedById: string | null
  paymentConfirmedByEmail: string | null
  downloadEmailSentAt: string | null
  /** Ödeme alındı ancak indirme e-postası gönderilemediyse admin için kısa uyarı (müşteriye gitmez). */
  digitalDeliveryEmailAlert?: string | null
  preInfoAcceptedAt: string | null
  distanceSalesAcceptedAt: string | null
  kvkkReadAt: string | null
  softwareLicenseAcceptedAt?: string | null
  saasSubscriptionAcceptedAt?: string | null
  digitalProductWaiverAcceptedAt?: string | null
  digitalServiceWaiverAcceptedAt?: string | null
  legalCartProductTypes?: string | null
  marketingConsentAt: string | null
  explicitConsentAt: string | null
  acceptedIp: string | null
  acceptedUserAgent: string | null
  createdAt: string
  updatedAt: string
  adminNote?: string | null
  shippingCarrier?: string | null
  shippingTrackingNumber?: string | null
  shippingStatus?: string | null
  customerId: string | null
  registeredCustomer: {
    id: string
    name: string
    email: string
    phone: string | null
  } | null
  customer: {
    customerName: string
    customerEmail: string
    customerPhone: string | null
    billingType: string | null
    taxOffice: string | null
    taxNumber: string | null
    companyName: string | null
  }
  items: {
    id: string
    productId: string | null
    productName: string
    productSlug: string | null
    unitPrice: number
    quantity: number
    total: number
    downloadUrl: string | null
  }[]
  paymentTransactions: {
    id: string
    merchantOid: string
    status: string
    amount: number
    currency: string
    providerRawPayload: unknown
    createdAt: string
    updatedAt: string
  }[]
  legalSnapshots: AdminOrderLegalSnapshot[]
  legalArchiveFiles?: AdminOrderLegalArchiveFile[]
  licenses?: AdminOrderLicenseRow[]
}

export type AdminOrderLicenseActivationRow = {
  id: string
  deviceHashShort: string
  deviceName: string | null
  platform: string | null
  appVersion: string | null
  firstActivatedAt: string
  lastValidatedAt: string | null
  status: string
}

export type AdminOrderLicenseRow = {
  id: string
  licenseKey: string
  status: string
  productName: string
  customerEmail: string
  maxDevices: number
  activatedDevicesCount: number
  lastValidatedAt: string | null
  expiresAt: string | null
  activations: AdminOrderLicenseActivationRow[]
}

export type AdminOrderLicensePatchBody = {
  status?: 'ACTIVE' | 'DISABLED'
  resetActivations?: boolean
  maxDevices?: number
}

export type AdminOrderUpdateBody = {
  status?: string
  paymentTransactionStatus?: string
  adminNote?: string | null
  shippingCarrier?: string | null
  shippingTrackingNumber?: string | null
  shippingStatus?: string | null
}

export const ordersAdminApi = {
  async list(params?: AdminOrderListParams): Promise<AdminOrderListRow[]> {
    const res = await apiClient.get<{ success: boolean; data: AdminOrderListRow[] }>('/admin/orders', { params })
    return res.data.data
  },

  async getById(id: string): Promise<AdminOrderDetail> {
    const res = await apiClient.get<unknown>(`/admin/orders/${encodeURIComponent(id)}`)
    const body = res.data as { success?: boolean; data?: AdminOrderDetail; message?: string }
    if (body?.data) return body.data
    console.error('[ordersAdminApi.getById] Beklenmeyen yanıt gövdesi', body)
    throw new Error(body?.message || 'Sipariş detayı alınamadı')
  },

  async confirmBankPayment(
    id: string,
    body: { paymentDate: string; bankNote: string; reference?: string },
  ): Promise<{ orderNo: string; alreadyPaid: boolean }> {
    const res = await apiClient.patch<unknown>(
      `/admin/orders/${encodeURIComponent(id)}/confirm-bank-transfer`,
      body,
    )
    const out = res.data as { success?: boolean; data?: { orderNo: string; alreadyPaid: boolean }; message?: string }
    if (!out?.data) {
      console.error('[ordersAdminApi.confirmBankPayment] Geçersiz yanıt', out)
      throw new Error(out?.message || 'Ödeme onayı yanıtı geçersiz')
    }
    return out.data
  },

  async update(id: string, body: AdminOrderUpdateBody): Promise<void> {
    const res = await apiClient.patch<unknown>(`/admin/orders/${encodeURIComponent(id)}`, body)
    const out = res.data as { success?: boolean; message?: string }
    if (!out?.success) {
      throw new Error(out?.message || 'Güncellenemedi')
    }
  },

  async delete(id: string): Promise<void> {
    const res = await apiClient.delete<unknown>(`/admin/orders/${encodeURIComponent(id)}`)
    const out = res.data as { success?: boolean; message?: string }
    if (!out?.success) {
      throw new Error(out?.message || 'Silinemedi')
    }
  },

  async patchOrderLicense(orderId: string, licenseId: string, body: AdminOrderLicensePatchBody): Promise<AdminOrderLicenseRow> {
    const res = await apiClient.patch<unknown>(
      `/admin/orders/${encodeURIComponent(orderId)}/licenses/${encodeURIComponent(licenseId)}`,
      body,
    )
    const out = res.data as { success?: boolean; data?: AdminOrderLicenseRow; message?: string }
    if (!out?.data) {
      throw new Error(out?.message || 'Lisans güncellenemedi')
    }
    return out.data
  },

  async generateLegalArchive(orderId: string, force = false): Promise<{ packageNo: string; files: AdminOrderLegalArchiveFile[] }> {
    const res = await apiClient.post<unknown>(`/admin/orders/${encodeURIComponent(orderId)}/legal-archive/generate`, {
      force,
    })
    const out = res.data as {
      success?: boolean
      data?: { packageNo: string; files: AdminOrderLegalArchiveFile[] }
      message?: string
      code?: string
    }
    if (!out?.data) {
      throw new Error(out?.message || 'Yasal arşiv oluşturulamadı')
    }
    return out.data
  },

  async downloadLegalArchiveFile(orderId: string, fileId: string, fileName: string): Promise<void> {
    const res = await apiClient.get<Blob>(
      `/admin/orders/${encodeURIComponent(orderId)}/legal-archive/files/${encodeURIComponent(fileId)}/download`,
      { responseType: 'blob' },
    )
    const blob = res.data instanceof Blob ? res.data : new Blob([res.data])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },
}
