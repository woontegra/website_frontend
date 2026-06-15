/** Sipariş satırında indirme yerine SaaS teslimi işaretlemek için backend’in kullandığı önek */
export function isSaasOrderDeliveryUrl(url: string | null | undefined): boolean {
  return typeof url === 'string' && url.startsWith('saas:')
}
