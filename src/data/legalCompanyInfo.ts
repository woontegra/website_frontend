export const LEGAL_COMPANY_PAGE_KEY = 'legalCompanyInfo'

export type LegalCompanyInfo = {
  companyName: string
  brandName: string
  email: string
  phone: string
  whatsapp: string
  website: string
  address: string
  city: string
  district: string
  taxOffice: string
  taxNumber: string
  mersisNumber: string
  dataControllerRepresentative: string
  instagram: string
  facebook: string
  linkedin: string
  twitter: string
  youtube: string
  lastUpdated: string
}

export const defaultLegalCompanyInfo: LegalCompanyInfo = {
  companyName: 'Woontegra Teknoloji Yazılım ve Dijital Hizmetler Ltd. Şti.',
  brandName: 'Woontegra',
  email: 'info@woontegra.com',
  phone: '0532 317 17 55',
  whatsapp: '0532 317 17 55',
  website: 'https://woontegra.com',
  address: 'İskele Mahallesi Bademli Caddesi 43/6 Datça-Muğla',
  city: 'Muğla',
  district: 'Datça',
  taxOffice: '',
  taxNumber: '',
  mersisNumber: '',
  dataControllerRepresentative: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  twitter: '',
  youtube: '',
  lastUpdated: '2026-06-08',
}

function pickString(value: string | undefined, fallback = ''): string {
  return value?.trim() || fallback
}

export function mergeLegalCompanyInfo(partial?: Partial<LegalCompanyInfo> | null): LegalCompanyInfo {
  if (!partial) return { ...defaultLegalCompanyInfo }

  return {
    companyName: pickString(partial.companyName, defaultLegalCompanyInfo.companyName),
    brandName: pickString(partial.brandName, defaultLegalCompanyInfo.brandName),
    email: pickString(partial.email, defaultLegalCompanyInfo.email),
    phone: pickString(partial.phone, defaultLegalCompanyInfo.phone),
    whatsapp: pickString(partial.whatsapp),
    website: pickString(partial.website, defaultLegalCompanyInfo.website),
    address: pickString(partial.address, defaultLegalCompanyInfo.address),
    city: pickString(partial.city),
    district: pickString(partial.district),
    taxOffice: pickString(partial.taxOffice),
    taxNumber: pickString(partial.taxNumber),
    mersisNumber: pickString(partial.mersisNumber),
    dataControllerRepresentative: pickString(partial.dataControllerRepresentative),
    instagram: pickString(partial.instagram),
    facebook: pickString(partial.facebook),
    linkedin: pickString(partial.linkedin),
    twitter: pickString(partial.twitter),
    youtube: pickString(partial.youtube),
    lastUpdated: pickString(partial.lastUpdated, defaultLegalCompanyInfo.lastUpdated),
  }
}

export function formatLegalDate(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatCompanyAddress(info: LegalCompanyInfo): string {
  const parts = [info.address?.trim(), info.district?.trim(), info.city?.trim()].filter(Boolean)
  return parts.join(', ')
}
