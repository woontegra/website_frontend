import axios from 'axios'
import { getApiUrl } from '../config/api'
import { getCustomerToken } from '../lib/customerAuth'
import type { BankTransferInfoDto } from '../lib/bankTransferTypes'

const apiRoot = getApiUrl().endsWith('/api') ? getApiUrl() : `${getApiUrl()}/api`

const pub = axios.create({ baseURL: apiRoot })

function customerAuthHeaders(): Record<string, string> {
  const t = getCustomerToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export type CreateOrderBody = {
  items: { productId: string; quantity: number }[]
  customerName: string
  customerEmail: string
  customerPhone?: string
  billingType?: string
  taxOffice?: string
  taxNumber?: string
  companyName?: string
  deliveryCity?: string
  deliveryDistrict?: string
  deliveryLine?: string
  acceptPreInfo: boolean
  acceptDistanceSales: boolean
  acceptKvkk: boolean
  acceptSoftwareLicense?: boolean
  acceptSaasSubscription?: boolean
  acceptDigitalProductWaiver?: boolean
  acceptDigitalServiceWaiver?: boolean
  marketingConsent?: boolean
  explicitConsent?: boolean
  paymentMethod?: 'PAYTR' | 'BANK_TRANSFER'
}

export type CreateOrderResponse = {
  orderNo: string
  id: string
  status: string
  total: number
  currency: string
  paymentProvider: string
}

export type { BankTransferInfoDto }

export type OrderSuccessLine = {
  productName: string
  quantity: number
  lineTotal: number
}

export type OrderSuccessPending = {
  status: 'PENDING'
  message: string
  orderNo: string
  customerEmail: string
  paymentStatusLabel: string
  /** BANK_TRANSFER: Havale bekliyor; kart siparişinde PayTR beklenir */
  paymentProvider?: string
  lines: OrderSuccessLine[]
  orderTotal: number
  currency: string
  bankTransferInfo?: BankTransferInfoDto | null
}

export type OrderSuccessFailed = {
  status: 'FAILED' | 'CANCELLED'
  message: string
  orderNo: string
  customerEmail: string
  paymentStatusLabel: string
  lines: OrderSuccessLine[]
  orderTotal: number
  currency: string
}

export type OrderSuccessPaidItem = {
  productName: string
  quantity: number
  lineTotal: number
  downloadUrl: string | null
}

export type OrderSuccessPaid = {
  status: 'PAID' | 'PROCESSING'
  orderNo: string
  customerEmail: string
  productName: string
  paymentStatusLabel: string
  lines: OrderSuccessLine[]
  orderTotal: number
  currency: string
  items: OrderSuccessPaidItem[]
  paidAt: string | null
  requiresEmail?: boolean
  message?: string
  paymentProvider?: string
  /** @deprecated tek ürün alanı; items kullanın */
  downloadUrl?: string | null
}

export type OrderSuccessData = OrderSuccessPending | OrderSuccessFailed | OrderSuccessPaid

export const ordersPublicApi = {
  async create(body: CreateOrderBody): Promise<CreateOrderResponse> {
    const res = await pub.post<{ success: boolean; data: CreateOrderResponse }>('/orders', body, {
      headers: customerAuthHeaders(),
    })
    return res.data.data
  },

  async lookup(orderNo: string, customerEmail: string) {
    const res = await pub.post<{ success: boolean; data: unknown }>('/orders/lookup', { orderNo, customerEmail })
    return res.data.data
  },

  async startPaytr(orderNo: string): Promise<string> {
    const res = await pub.post<{ success: boolean; data: { iframe_token: string } }>('/payments/paytr/start', {
      orderNo,
    })
    return res.data.data.iframe_token
  },

  async getSuccess(orderNo: string, customerEmail?: string): Promise<OrderSuccessData> {
    const q = customerEmail ? `?customerEmail=${encodeURIComponent(customerEmail)}` : ''
    const res = await pub.get<{ success: boolean; data: OrderSuccessData }>(
      `/orders/success/${encodeURIComponent(orderNo)}${q}`,
      { headers: customerAuthHeaders() },
    )
    return res.data.data
  },
}
