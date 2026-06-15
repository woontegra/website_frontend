import type { LegalDocType } from '../api/legal-documents-public'

export const LEGAL_CHECKOUT_DOC_SLUGS = [
  'on-bilgilendirme-formu',
  'mesafeli-satis-sozlesmesi',
  'elektronik-ileti-bilgilendirme',
  'pazarlama-acik-riza-metni',
] as const

export type LegalCheckoutDocSlug = (typeof LEGAL_CHECKOUT_DOC_SLUGS)[number]

export function isLegalCheckoutDocSlug(s: string): s is LegalCheckoutDocSlug {
  return (LEGAL_CHECKOUT_DOC_SLUGS as readonly string[]).includes(s)
}

export type LegalCheckoutDocConfig = {
  type: LegalDocType
  title: string
  subtitle: string
  seoTitle: string
  seoDescription: string
}

export const LEGAL_CHECKOUT_DOC_BY_SLUG: Record<LegalCheckoutDocSlug, LegalCheckoutDocConfig> = {
  'on-bilgilendirme-formu': {
    type: 'PRE_INFORMATION',
    title: 'Ön Bilgilendirme Formu',
    subtitle:
      'Mesafeli satın alma öncesi, ürün ve satıcı bilgileri, ödeme ve cayma hakkına ilişkin temel bilgilere buradan ulaşabilirsiniz.',
    seoTitle: 'Ön Bilgilendirme Formu | Woontegra',
    seoDescription: 'Dijital ürün satın alımı öncesi yasal ön bilgilendirme metni.',
  },
  'mesafeli-satis-sozlesmesi': {
    type: 'DISTANCE_SALES',
    title: 'Mesafeli Satış Sözleşmesi',
    subtitle: 'Dijital ürün satışına ilişkin mesafeli satış sözleşmesi metni.',
    seoTitle: 'Mesafeli Satış Sözleşmesi | Woontegra',
    seoDescription: 'Mesafeli satış sözleşmesi ve tarafların hak ve yükümlülükleri.',
  },
  'elektronik-ileti-bilgilendirme': {
    type: 'COMMERCIAL_ELECTRONIC_MESSAGE',
    title: 'Elektronik Ticari İleti Bilgilendirme Metni',
    subtitle: 'Kampanya ve duyurular için elektronik ileti iznine ilişkin bilgilendirme.',
    seoTitle: 'Elektronik Ticari İleti Bilgilendirmesi | Woontegra',
    seoDescription: 'Ticari elektronik ileti onayı ve geri çekme hakkı hakkında bilgilendirme.',
  },
  'pazarlama-acik-riza-metni': {
    type: 'EXPLICIT_CONSENT',
    title: 'Pazarlama Amaçlı Kişisel Veri İşleme Açık Rıza Metni',
    subtitle: 'Kişisel verilerinizin pazarlama amacıyla işlenmesine ilişkin açık rıza metni.',
    seoTitle: 'Pazarlama Açık Rıza Metni | Woontegra',
    seoDescription: 'Pazarlama ve kişiselleştirilmiş teklifler için açık rıza ve geri çekme.',
  },
}

/** API önizlemesinde sepet dışı sayfalar için güvenli yer tutucular (ham şablon etiketi kalmaz). */
export function legalCheckoutPreviewVariables(): Record<string, string> {
  return {
    customerName: '—',
    customerEmail: '—',
    orderNo: 'Ödeme onayından sonra sipariş numaranız oluşturulur ve size bildirilir.',
    orderTotal: '—',
    currency: 'TRY',
    productList:
      '<p>Ödeme adımında sepetinizdeki ürünler ve güncel tutarlar sipariş özetinde gösterilir. Bu sayfada örnek liste yer almaz.</p>',
  }
}
