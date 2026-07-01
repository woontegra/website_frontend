import type { ProductType } from '../api/products-admin'
import type { PublicProductListItem } from '../api/products-public'
import { formatMoneyAmount } from './formatMoney'

export { formatMoneyAmount }

export function formatProductPrice(p: Pick<PublicProductListItem, 'price' | 'currency'>) {
  return formatMoneyAmount(p.price, p.currency)
}

/** Web tabanlı ürünlerde kullanım süresi (yıl) ile çarpılmış satır tutarı. */
export function saasTotalForYears(unitPrice: number, years: number): number {
  const y = Math.min(10, Math.max(1, Math.floor(Number(years)) || 1))
  return unitPrice * y
}
/** Masaüstü: tek seferlik; web tabanlı (API: SAAS): yıllık — liste ve detayda aynı metin. */
export function productPricePeriodSuffix(productType: ProductType): string {
  switch (productType) {
    case 'DOWNLOAD':
      return '/ tek seferlik'
    case 'SAAS':
    case 'SERVICE':
      return '/ yıllık'
    default:
      return ''
  }
}
