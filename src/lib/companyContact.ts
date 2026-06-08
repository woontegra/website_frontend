import type { LegalCompanyInfo } from '../data/legalCompanyInfo'
import type { FooterGroupConfig } from '../data/footerGroupsContent'

export function formatPhoneForTel(phone: string): string {
  return phone.replace(/\s/g, '').replace(/[^\d+]/g, '')
}

export function buildWhatsAppUrl(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  const normalized = digits.startsWith('90') ? digits : `90${digits.replace(/^0/, '')}`
  return `https://wa.me/${normalized}`
}

export function isValidHttpUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function normalizeWebsiteUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

export function resolveFooterContactLinks(groups: FooterGroupConfig[], info: LegalCompanyInfo): FooterGroupConfig[] {
  const email = info.email?.trim()
  const whatsappUrl = info.whatsapp?.trim() ? buildWhatsAppUrl(info.whatsapp) : null

  return groups.map((group) => {
    if (group.id !== 'iletisim') return group
    return {
      ...group,
      links: group.links.map((link) => {
        if (link.href?.startsWith('mailto:') && email) {
          return { ...link, href: `mailto:${email}`, label: email }
        }
        if ((link.href?.includes('wa.me') || link.label.toLowerCase().includes('whatsapp')) && whatsappUrl) {
          return { ...link, href: whatsappUrl }
        }
        return link
      }),
    }
  })
}
