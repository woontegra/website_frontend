import type { MergedCartRow } from '../lib/cartMerge'
import { checkoutProductKindLabel, isWebBasedCheckoutProduct } from './checkoutProductLabels'
import { formatMoneyAmount } from './formatMoney'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildCheckoutLegalProductListHtml(merged: MergedCartRow[]): string {
  if (merged.length === 0) {
    return '<p>Sepetinizde ürün bulunmuyor.</p>'
  }
  const items = merged
    .map((m) => {
      const web = isWebBasedCheckoutProduct(m.productType)
      const typeLabel = checkoutProductKindLabel(m.productType)
      const plan = web ? 'Yıllık Abonelik' : 'Ömür Boyu Lisans'
      const qty = web ? `${m.quantity} yıl` : `${m.quantity} adet`
      const price = formatMoneyAmount(m.lineTotal, m.currency)
      return `<li><strong>${escapeHtml(m.name)}</strong> — ${escapeHtml(typeLabel)} — ${escapeHtml(plan)} — ${escapeHtml(qty)} — ${escapeHtml(price)}</li>`
    })
    .join('')
  return `<ul>${items}</ul>`
}

export type CheckoutLegalFormInput = {
  customerName: string
  customerEmail: string
  customerPhone: string
  billingType: '' | 'Bireysel' | 'Kurumsal'
  companyName: string
  taxOffice: string
  taxNumber: string
  deliveryCity: string
  deliveryDistrict: string
  deliveryLine: string
}

function pick(value: string): string {
  return value.trim()
}

/** Checkout yasal önizleme API'sine gönderilecek değişkenler (ham metin; HTML backend'de üretilir). */
export function buildCheckoutLegalPreviewVariables(input: {
  form: CheckoutLegalFormInput
  merged: MergedCartRow[]
  grand: number
  currency: string
}): Record<string, string> {
  const { form } = input
  const vars: Record<string, string> = {
    customerName: pick(form.customerName),
    buyerName: pick(form.customerName),
    customerEmail: pick(form.customerEmail),
    email: pick(form.customerEmail),
    customerPhone: pick(form.customerPhone),
    phone: pick(form.customerPhone),
    billingType: pick(form.billingType),
    invoiceType: pick(form.billingType),
    companyName: pick(form.companyName),
    taxOffice: pick(form.taxOffice),
    taxNumber: pick(form.taxNumber),
    identityNumber: pick(form.taxNumber),
    city: pick(form.deliveryCity),
    district: pick(form.deliveryDistrict),
    addressLine: pick(form.deliveryLine),
    address: pick(form.deliveryLine),
    orderNo: 'Ödeme onayından sonra sipariş numaranız oluşturulur.',
    orderTotal: Number.isFinite(input.grand) ? input.grand.toFixed(2) : '0.00',
    currency: '₺',
    productList: buildCheckoutLegalProductListHtml(input.merged),
  }

  const addressParts = [vars.addressLine, vars.district, vars.city].filter(Boolean)
  if (addressParts.length > 0) {
    vars.fullAddress = addressParts.join(', ')
  }

  return Object.fromEntries(Object.entries(vars).filter(([, v]) => v !== ''))
}
