import { buildApiUrl } from '../config/api'
import { clearCustomerSession, customerFetch, getCustomerToken, saveCustomerSession, type CustomerProfile } from '../lib/customerAuth'

export type LoginRegisterResponse = {
  token: string
  customer: CustomerProfile
}

export type CustomerSaasMembershipRow = {
  id: string
  productCode: string
  productName: string
  tenantSlug: string
  licenseKey: string
  status: string
  licenseStartDate: string
  licenseEndDate: string
  kalanGun: number | null
  ownerEmail: string
}

export type SaasRenewQuote = {
  membershipId: string
  renewalPeriod: string
  renewalDays: number
  renewalLabel: string
  productName: string
  lineLabel: string
  total: number
  currency: string
}

export type SaasRenewOrderResult = {
  id: string
  orderNo: string
  total: number
  currency: string
  paymentProvider: string
  renewalPeriod: string
  renewalDays: number
  renewalLabel: string
  productName: string
  membershipId: string
}

export const customersApi = {
  async register(body: { name: string; email: string; password: string; phone?: string }): Promise<LoginRegisterResponse> {
    const res = await fetch(buildApiUrl('/customers/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as { success?: boolean; data?: LoginRegisterResponse; message?: string }
    if (!res.ok || !json.success || !json.data) throw new Error(json.message || 'Kayıt başarısız')
    saveCustomerSession(json.data.token, json.data.customer)
    return json.data
  },

  async login(email: string, password: string): Promise<LoginRegisterResponse> {
    const res = await fetch(buildApiUrl('/customers/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = (await res.json()) as { success?: boolean; data?: LoginRegisterResponse; message?: string }
    if (!res.ok || !json.success || !json.data) throw new Error(json.message || 'Giriş başarısız')
    saveCustomerSession(json.data.token, json.data.customer)
    return json.data
  },

  logoutLocal() {
    clearCustomerSession()
  },

  async getMe(): Promise<CustomerProfile> {
    const res = await customerFetch('/customers/me')
    const json = (await res.json()) as { success?: boolean; data?: CustomerProfile }
    if (!res.ok || !json.success || !json.data) throw new Error('Oturum gerekli')
    return json.data
  },

  async patchMe(body: Partial<{ name: string; phone: string | null; email: string; currentPassword: string }>): Promise<CustomerProfile> {
    const res = await customerFetch('/customers/me', { method: 'PATCH', body: JSON.stringify(body) })
    const json = (await res.json()) as { success?: boolean; data?: CustomerProfile; message?: string }
    if (!res.ok || !json.success) throw new Error(json.message || 'Güncellenemedi')
    const profile = json.data ?? (await customersApi.getMe())
    if (getCustomerToken()) saveCustomerSession(getCustomerToken()!, profile)
    return profile
  },

  async patchPassword(currentPassword: string, newPassword: string) {
    const res = await customerFetch('/customers/me/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const json = (await res.json()) as { success?: boolean; message?: string }
    if (!res.ok || !json.success) throw new Error(json.message || 'Şifre değiştirilemedi')
  },

  async listAddresses() {
    const res = await customerFetch('/customers/me/addresses')
    const json = (await res.json()) as { success?: boolean; data: unknown[] }
    if (!res.ok || !json.success) throw new Error('Adresler yüklenemedi')
    return json.data
  },

  async createAddress(body: Record<string, unknown>) {
    const res = await customerFetch('/customers/me/addresses', { method: 'POST', body: JSON.stringify(body) })
    const json = (await res.json()) as { success?: boolean; data?: { id: string }; message?: string }
    if (!res.ok || !json.success) throw new Error(json.message || 'Kaydedilemedi')
    return json.data
  },

  async patchAddress(id: string, body: Record<string, unknown>) {
    const res = await customerFetch(`/customers/me/addresses/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as { success?: boolean; message?: string }
    if (!res.ok || !json.success) throw new Error(json.message || 'Güncellenemedi')
  },

  async deleteAddress(id: string) {
    const res = await customerFetch(`/customers/me/addresses/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Silinemedi')
  },

  async listOrders() {
    const res = await customerFetch('/customers/me/orders')
    const json = (await res.json()) as { success?: boolean; data: unknown[] }
    if (!res.ok || !json.success) throw new Error('Siparişler yüklenemedi')
    return json.data
  },

  async getOrder(orderNo: string) {
    const res = await customerFetch(`/customers/me/orders/${encodeURIComponent(orderNo)}`)
    const json = (await res.json()) as { success?: boolean; data: unknown; message?: string }
    if (!res.ok || !json.success) throw new Error(json.message || 'Bulunamadı')
    return json.data
  },

  async listFavorites() {
    const res = await customerFetch('/customers/me/favorites')
    const json = (await res.json()) as { success?: boolean; data: unknown[] }
    if (!res.ok || !json.success) throw new Error('Favoriler yüklenemedi')
    return json.data
  },

  async addFavorite(productId: string) {
    const res = await customerFetch(`/customers/me/favorites/${encodeURIComponent(productId)}`, { method: 'POST' })
    if (!res.ok) {
      const j = (await res.json()) as { message?: string }
      throw new Error(j.message || 'Eklenemedi')
    }
  },

  async removeFavorite(productId: string) {
    const res = await customerFetch(`/customers/me/favorites/${encodeURIComponent(productId)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Kaldırılamadı')
  },

  async listSaasMemberships(): Promise<CustomerSaasMembershipRow[]> {
    const res = await customerFetch('/customers/me/saas-memberships')
    const json = (await res.json()) as { success?: boolean; data?: CustomerSaasMembershipRow[] }
    if (!res.ok || !json.success || !json.data) throw new Error('Üyelikler yüklenemedi')
    return json.data
  },

  async getSaasRenewQuote(membershipId: string, renewalPeriod: string): Promise<SaasRenewQuote> {
    const q = new URLSearchParams({ renewalPeriod })
    const res = await customerFetch(
      `/customers/me/saas-memberships/${encodeURIComponent(membershipId)}/renew-quote?${q}`,
    )
    const json = (await res.json()) as { success?: boolean; data?: SaasRenewQuote; message?: string }
    if (!res.ok || !json.success || !json.data) throw new Error(json.message || 'Fiyat alınamadı')
    return json.data
  },

  async createSaasRenewOrder(
    membershipId: string,
    body: {
      renewalPeriod: string
      paymentProvider?: 'BANK_TRANSFER' | 'PAYTR'
      acceptPreInfo: boolean
      acceptDistanceSales: boolean
      acceptKvkk: boolean
      acceptSaasSubscription: boolean
      acceptDigitalServiceWaiver: boolean
    },
  ): Promise<SaasRenewOrderResult> {
    const res = await customerFetch(`/customers/me/saas-memberships/${encodeURIComponent(membershipId)}/renew-order`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as { success?: boolean; data?: SaasRenewOrderResult; message?: string }
    if (!res.ok || !json.success || !json.data) throw new Error(json.message || 'Sipariş oluşturulamadı')
    return json.data
  },
}
