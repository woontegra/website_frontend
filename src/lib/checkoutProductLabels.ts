import type { ProductType } from '../api/products-admin'

/** Checkout ve yasal metinlerde kullanıcıya gösterilen ürün türü (API dahili terimleri göstermez). */
export function checkoutProductKindLabel(productType: ProductType): string {
  switch (productType) {
    case 'DOWNLOAD':
      return 'Masaüstü program'
    case 'SAAS':
      return 'Web tabanlı program'
    case 'SERVICE':
      return 'Dijital hizmet'
    default:
      return 'Ürün / hizmet'
  }
}

export function isWebBasedCheckoutProduct(productType: ProductType): boolean {
  return productType === 'SAAS' || productType === 'SERVICE'
}
