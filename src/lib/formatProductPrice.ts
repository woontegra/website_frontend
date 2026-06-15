import type { ProductType } from '../api/products-admin'
import type { PublicProductListItem } from '../api/products-public'
import { formatMoneyAmount } from './formatMoney'

export { formatMoneyAmount }

export function formatProductPrice(p: Pick<PublicProductListItem, 'price' | 'currency'>) {
  return formatMoneyAmount(p.price, p.currency)
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
