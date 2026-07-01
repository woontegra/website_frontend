const MK_SAAS_SLUGS = new Set([
  'muvekkil-kasa-saas',
  'muvekkil-kasa-defteri-saas',
  'muvekkil-kasa-defteri-web-tabanli',
])

export type MuvekkilKasaSaasProductRef = {
  slug?: string | null
  licenseAppCode?: string | null
}

export function isMuvekkilKasaSaasProduct(product: MuvekkilKasaSaasProductRef | null | undefined): boolean {
  if (!product) return false
  const slug = product.slug?.trim().toLowerCase()
  if (slug && MK_SAAS_SLUGS.has(slug)) return true
  return product.licenseAppCode?.trim() === 'MUVEKKIL_KASA_SAAS'
}

export const SAAS_LOGIN_REQUIRED_MESSAGE =
  'SaaS ürün satın almak için müşteri hesabınızla giriş yapmanız gerekir.'
