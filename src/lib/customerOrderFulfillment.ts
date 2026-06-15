/**
 * Müşteri sipariş ekranları: ürün tipine göre teslimat akışı, adımlar ve rozet metinleri.
 * Prisma ProductType: DOWNLOAD | SAAS | SERVICE (+ ileride eklenebilecek stringler).
 */

import {
  customerOrderStatusBadgeTone,
  customerPaymentMethodLabel,
  customerPaymentStatusBadgeTone,
  customerPaymentStatusLabel,
  normalizeCustomerToken,
} from './customerAccountLabels'
import { isSaasOrderDeliveryUrl } from './orderDeliveryUrl'
import type { AccountBadgeTone } from './customerAccountLabels'

export type OrderFulfillmentKind =
  | 'physical'
  | 'digital_download'
  | 'saas'
  | 'desktop_software'
  | 'mixed_digital'

export type CustomerOrderStep = {
  key: string
  title: string
  done: boolean
  active: boolean
  hint?: string
}

export type CustomerOrderItemLike = {
  downloadUrl: string | null
  productType?: string | null
}

export type CustomerOrderDetailLike = {
  status: string
  paymentStatus: string | null
  paymentProvider: string
  paymentMethod?: string | null
  shippingTrackingNumber?: string | null
  items: CustomerOrderItemLike[]
}

function isHttpUrl(s: string | null | undefined): boolean {
  if (!s?.trim()) return false
  try {
    const u = new URL(s.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/** `saas:slug` → ürün sayfası slug */
export function parseSaasDeliverySlug(url: string | null | undefined): string | null {
  if (!url || !url.startsWith('saas:')) return null
  const s = url.slice(5).trim()
  return s || null
}

type LineCategory = 'physical' | 'download' | 'saas' | 'desktop' | 'unknown'

function categorizeProductType(raw: string | null | undefined): LineCategory {
  const k = normalizeCustomerToken(raw)
  if (!k) return 'unknown'
  if (k === 'PHYSICAL') return 'physical'
  if (k === 'DOWNLOAD' || k === 'DIGITAL') return 'download'
  if (k === 'SAAS' || k === 'WEB_SOFTWARE') return 'saas'
  if (k === 'SERVICE' || k === 'SOFTWARE' || k === 'DESKTOP') return 'desktop'
  return 'unknown'
}

/** Sipariş satırlarındaki productType değerlerinden teslimat türü */
export function getOrderFulfillmentKind(productTypes: (string | null | undefined)[]): OrderFulfillmentKind {
  const cats = productTypes.map(categorizeProductType)
  if (cats.includes('physical')) return 'physical'

  const known = cats.filter((c) => c !== 'unknown')
  const use = known.length > 0 ? known : cats

  const uniq = new Set(use)
  if (uniq.size === 1) {
    const only = [...uniq][0]
    if (only === 'physical') return 'physical'
    if (only === 'download' || only === 'unknown') return 'digital_download'
    if (only === 'saas') return 'saas'
    if (only === 'desktop') return 'desktop_software'
  }

  if (uniq.has('physical')) return 'physical'
  if (uniq.has('saas')) return 'mixed_digital'
  if (uniq.has('desktop') && uniq.has('download')) return 'mixed_digital'
  if (uniq.has('desktop')) return 'desktop_software'
  return 'digital_download'
}

export function getCustomerPaymentMethodDisplayLabel(
  paymentProvider: string | null | undefined,
  paymentMethod?: string | null,
): string {
  const p = normalizeCustomerToken(paymentProvider)
  const m = normalizeCustomerToken(paymentMethod)
  if (p) return customerPaymentMethodLabel(paymentProvider)
  if (m) return customerPaymentMethodLabel(paymentMethod)
  return 'Ödeme yöntemi belirlenemedi'
}

/** paymentStatus boş gelse bile sipariş durumuna göre anlamlı metin */
export function getCustomerPaymentStatusDisplayLabel(
  paymentStatus: string | null | undefined,
  ctx: { orderStatus: string; paymentProvider?: string | null },
): string {
  const k = normalizeCustomerToken(paymentStatus)
  if (k) return customerPaymentStatusLabel(paymentStatus)

  const st = normalizeCustomerToken(ctx.orderStatus)
  const pp = normalizeCustomerToken(ctx.paymentProvider)

  if (st === 'PAID' || st === 'PROCESSING') return 'Ödeme alındı'
  if (st === 'PENDING') {
    if (pp) return 'Ödeme bekleniyor'
    return 'Ödeme bekleniyor'
  }
  if (st === 'FAILED') return customerPaymentStatusLabel('FAILED')
  if (st === 'CANCELLED') return customerPaymentStatusLabel('CANCELLED')
  if (pp) return 'Ödeme bekleniyor'
  return 'Ödeme durumu güncelleniyor'
}

function paymentCtx(d: CustomerOrderDetailLike) {
  const ps = normalizeCustomerToken(d.paymentStatus)
  const st = normalizeCustomerToken(d.status)
  const isBank = normalizeCustomerToken(d.paymentProvider) === 'BANK_TRANSFER'
  const paymentOk = ps === 'SUCCESS' || ps === 'PAID' || st === 'PAID'
  const paymentWait = ps === 'PENDING' || ps === 'WAITING_BANK_TRANSFER' || ps === ''
  const tracking = Boolean(d.shippingTrackingNumber?.trim())
  return { ps, st, isBank, paymentOk, paymentWait, tracking }
}

/** Siparişte gerçek (http/https) indirme veya teslimat URL’si var mı? */
export function orderHasHttpDownloadLink(items: CustomerOrderItemLike[]): boolean {
  return items.some((i) => {
    const u = i.downloadUrl?.trim()
    if (!u || isSaasOrderDeliveryUrl(u)) return false
    return isHttpUrl(u)
  })
}

export function orderHasSaasPanelSlug(items: CustomerOrderItemLike[]): boolean {
  return items.some((i) => Boolean(parseSaasDeliverySlug(i.downloadUrl)))
}

/** Dijital / masaüstü: teslimat e-posta ile; indirme butonu Hesabım’da yok. */
function emailDigitalDeliverySteps(d: CustomerOrderDetailLike, payHintBank: string | undefined): CustomerOrderStep[] {
  const { paymentOk, paymentWait } = paymentCtx(d)
  const s1 = true
  const s2 = paymentOk
  const prepDone = paymentOk
  const emailDone = paymentOk
  return [
    { key: 'placed', title: 'Sipariş alındı', done: s1, active: s1 && !s2 },
    {
      key: 'pay',
      title: 'Ödeme',
      done: s2,
      active: s1 && !s2 && paymentWait,
      hint: payHintBank,
    },
    {
      key: 'prep_email',
      title: 'Teslimat hazırlanıyor',
      done: prepDone,
      active: false,
    },
    {
      key: 'sent_email',
      title: 'E-posta ile gönderildi',
      done: emailDone,
      active: false,
    },
  ]
}

export function buildCustomerOrderSteps(kind: OrderFulfillmentKind, d: CustomerOrderDetailLike): CustomerOrderStep[] {
  const { ps, st, isBank, paymentOk, paymentWait, tracking } = paymentCtx(d)
  const s1 = true
  const s2 = paymentOk

  const payHintBank = isBank && ps === 'WAITING_BANK_TRANSFER' ? 'Havale/EFT ödemeniz kontrol ediliyor.' : undefined

  switch (kind) {
    case 'physical': {
      const s4Done = st === 'PAID' || (tracking && st === 'PROCESSING')
      const s4Active = tracking && st === 'PROCESSING'
      const s5 = st === 'PAID'
      return [
        { key: 'placed', title: 'Sipariş alındı', done: s1, active: s1 && !s2 },
        {
          key: 'pay',
          title: 'Ödeme',
          done: s2,
          active: s1 && !s2 && paymentWait,
          hint: payHintBank,
        },
        { key: 'prep', title: 'Hazırlanıyor', done: paymentOk && (st === 'PROCESSING' || st === 'PAID'), active: s2 && st === 'PROCESSING' && !tracking },
        { key: 'ship', title: 'Kargoda', done: s4Done, active: s4Active },
        { key: 'done', title: 'Teslim edildi', done: s5, active: s5 },
      ]
    }
    case 'digital_download':
    case 'desktop_software':
    case 'mixed_digital':
      return emailDigitalDeliverySteps(d, payHintBank)
    case 'saas': {
      const hasAccess =
        orderHasSaasPanelSlug(d.items) ||
        d.items.some((i) => {
          const u = i.downloadUrl?.trim()
          return Boolean(u && isHttpUrl(u) && !isSaasOrderDeliveryUrl(u))
        })
      const prepDone = paymentOk && hasAccess
      const prepActive = paymentOk && !hasAccess && (st === 'PROCESSING' || st === 'PAID')
      const readyDone = paymentOk && hasAccess
      const readyActive = readyDone
      const payHintSaaS = !paymentOk && st === 'PENDING' ? 'Ödemeniz tamamlandığında hesap bilgileriniz paylaşılacaktır.' : undefined
      const prepHint = prepActive ? 'Hesabınız hazırlanıyor. Bilgileriniz tamamlandığında size iletilecektir.' : undefined
      return [
        { key: 'placed', title: 'Sipariş alındı', done: s1, active: s1 && !s2 },
        {
          key: 'pay',
          title: 'Ödeme',
          done: s2,
          active: s1 && !s2 && paymentWait,
          hint: payHintBank ?? payHintSaaS,
        },
        {
          key: 'acct',
          title: 'Hesap hazırlanıyor',
          done: prepDone,
          active: prepActive,
          hint: prepHint,
        },
        { key: 'use', title: 'Kullanıma hazır', done: readyDone, active: readyActive },
      ]
    }
  }
}

/** Üst sipariş rozeti metni — ödeme ve gerçek teslimat linkine göre */
export function getFulfillmentOrderStatusBadgeLabel(d: CustomerOrderDetailLike, kind: OrderFulfillmentKind): string {
  const { ps, st, paymentOk } = paymentCtx(d)
  const saasReady = orderHasSaasPanelSlug(d.items)
  const httpNonSaas = d.items.some((i) => {
    const u = i.downloadUrl?.trim()
    return Boolean(u && isHttpUrl(u) && !isSaasOrderDeliveryUrl(u))
  })
  const noLines = d.items.length === 0

  if (st === 'FAILED') return 'Ödeme başarısız'
  if (st === 'CANCELLED') return 'İptal edildi'

  if (kind === 'physical') {
    if (st === 'PENDING') return 'Sipariş alındı'
    if (!paymentOk) return ps === 'WAITING_BANK_TRANSFER' ? 'Havale/EFT onayı bekleniyor' : 'Ödeme bekleniyor'
    if (st === 'PROCESSING') return 'Hazırlanıyor'
    if (st === 'PAID') return 'Teslim edildi'
    return 'Durum bilinmiyor'
  }

  if (noLines && paymentOk && (st === 'PAID' || st === 'PROCESSING')) {
    if (st === 'PAID') return 'Tamamlandı'
    if (kind === 'saas') return 'Hesap hazırlanıyor'
    if (kind === 'digital_download' || kind === 'desktop_software' || kind === 'mixed_digital') {
      return 'Teslimat e-posta ile gönderildi'
    }
    return 'Hazırlanıyor'
  }

  if (!paymentOk) {
    return ps === 'WAITING_BANK_TRANSFER' ? 'Havale/EFT onayı bekleniyor' : 'Ödeme bekleniyor'
  }

  if (kind === 'digital_download' || kind === 'desktop_software' || kind === 'mixed_digital') {
    return 'Teslimat e-posta ile gönderildi'
  }
  if (kind === 'saas') {
    if (!saasReady && !httpNonSaas) return 'Hesap hazırlanıyor'
    return 'Kullanıma hazır'
  }

  return 'Durum bilinmiyor'
}

export function getFulfillmentOrderHeaderBadgeTone(d: CustomerOrderDetailLike, kind: OrderFulfillmentKind): AccountBadgeTone {
  if (kind === 'physical') return customerOrderStatusBadgeTone(d.status)
  const st = normalizeCustomerToken(d.status)
  const { paymentOk } = paymentCtx(d)
  if (st === 'FAILED') return 'danger'
  if (st === 'CANCELLED') return 'muted'
  if (!paymentOk) return 'warning'

  if (kind === 'digital_download' || kind === 'desktop_software' || kind === 'mixed_digital') {
    return customerPaymentStatusBadgeTone('SUCCESS')
  }
  if (kind === 'saas') {
    const ready =
      orderHasSaasPanelSlug(d.items) ||
      d.items.some((i) => {
        const u = i.downloadUrl?.trim()
        return Boolean(u && isHttpUrl(u) && !isSaasOrderDeliveryUrl(u))
      })
    return ready ? customerPaymentStatusBadgeTone('SUCCESS') : 'info'
  }
  if (kind === 'mixed_digital') {
    return customerPaymentStatusBadgeTone('SUCCESS')
  }
  return 'neutral'
}

export function getPaymentStatusBadgeToneForDisplay(
  paymentStatus: string | null | undefined,
  orderStatus: string,
): AccountBadgeTone {
  const k = normalizeCustomerToken(paymentStatus)
  const st = normalizeCustomerToken(orderStatus)
  if (k) return customerPaymentStatusBadgeTone(paymentStatus)
  if (st === 'PAID' || st === 'PROCESSING') return customerPaymentStatusBadgeTone('SUCCESS')
  return customerPaymentStatusBadgeTone('PENDING')
}

export function getFulfillmentOrderStatusBadgeTone(d: CustomerOrderDetailLike): AccountBadgeTone {
  return customerOrderStatusBadgeTone(d.status)
}

export function orderPaymentIsSettled(
  paymentStatus: string | null | undefined,
  orderStatus?: string | null,
): boolean {
  const k = normalizeCustomerToken(paymentStatus)
  if (k === 'SUCCESS' || k === 'PAID') return true
  const st = normalizeCustomerToken(orderStatus)
  return st === 'PAID'
}

export type LineDeliveryUi =
  | { type: 'none' }
  | { type: 'info'; message: string }
  | { type: 'download'; href: string }
  | { type: 'panel'; slug: string }
  | { type: 'license'; href: string }

export function getCustomerOrderLineDeliveryUi(
  item: { downloadUrl: string | null; productType: string | null },
  ctx: { paymentOk: boolean; orderStatus: string },
): LineDeliveryUi {
  const cat = categorizeProductType(item.productType)
  const st = normalizeCustomerToken(ctx.orderStatus)
  const canDeliver = ctx.paymentOk && (st === 'PAID' || st === 'PROCESSING')
  const url = item.downloadUrl?.trim() ?? ''
  const http = url.length > 0 && isHttpUrl(url) && !isSaasOrderDeliveryUrl(url)
  const slug = parseSaasDeliverySlug(item.downloadUrl)

  if (cat === 'physical') return { type: 'none' }
  if (cat === 'download' || cat === 'desktop' || cat === 'unknown') return { type: 'none' }

  if (cat !== 'saas') return { type: 'none' }

  if (!ctx.paymentOk) {
    return { type: 'info', message: 'Ödemeniz tamamlandığında hesap bilgileriniz paylaşılacaktır.' }
  }

  if (canDeliver && slug) return { type: 'panel', slug }
  if (canDeliver && http) return { type: 'download', href: url }
  return {
    type: 'info',
    message: 'Hesap hazırlanıyor. Bilgileriniz tamamlandığında size iletilecektir.',
  }
}

export function isEmailDeliveryFulfillmentKind(kind: OrderFulfillmentKind): boolean {
  return kind === 'digital_download' || kind === 'desktop_software' || kind === 'mixed_digital'
}

export type PostFulfillmentCard =
  | { variant: 'physical'; title: string }
  | { variant: 'digital'; title: string; body: string }
  | { variant: 'saas'; title: string; body: string; panelSlug: string | null }
  | { variant: 'desktop'; title: string; body: string }

export function getPostFulfillmentCard(d: CustomerOrderDetailLike, kind: OrderFulfillmentKind): PostFulfillmentCard {
  if (kind === 'physical') {
    return { variant: 'physical', title: 'Kargo bilgileri' }
  }
  if (kind === 'saas') {
    const slug =
      d.items.map((i) => parseSaasDeliverySlug(i.downloadUrl)).find((s): s is string => Boolean(s)) ?? null
    return {
      variant: 'saas',
      title: 'Hesap erişimi',
      body: 'Hesabınız hazır olduğunda erişim bilgileriniz bu alanda görüntülenir.',
      panelSlug: slug,
    }
  }
  if (kind === 'desktop_software') {
    return {
      variant: 'desktop',
      title: 'Lisans ve indirme',
      body: 'Lisans bilgileriniz ve indirme bağlantınız hazır olduğunda burada görüntülenir.',
    }
  }
  return {
    variant: 'digital',
    title: 'Dijital teslimat',
    body: 'Ödemeniz tamamlandığında indirme bağlantınız burada görüntülenir.',
  }
}
