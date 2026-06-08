import {
  defaultLegalAcikRizaPage,
  defaultLegalCookiePage,
  defaultLegalKvkkPage,
  defaultLegalPrivacyPage,
  defaultLegalTermsPage,
} from './legalPageDefaults'

export const LEGAL_KVKK_PAGE_KEY = 'legalKvkkPage'
export const LEGAL_PRIVACY_PAGE_KEY = 'legalPrivacyPage'
export const LEGAL_COOKIE_PAGE_KEY = 'legalCookiePage'
export const LEGAL_CONSENT_PAGE_KEY = 'legalConsentPage'
export const LEGAL_TERMS_PAGE_KEY = 'legalTermsPage'

export type LegalSectionKind =
  | 'default'
  | 'company-details'
  | 'cookie-inventory-category'
  | 'cookie-inventory-all'
  | 'cookie-preferences'

export type LegalPageSection = {
  id: string
  title: string
  body: string
  order: number
  active: boolean
  listItems?: string[]
  kind?: LegalSectionKind
  cookieCategory?: 'necessary' | 'analytics' | 'marketing' | 'functional'
}

export type LegalPageContent = {
  enabled: boolean
  title: string
  description: string
  updatedAtLabel: string
  sections: LegalPageSection[]
  seoTitle: string
  seoDescription: string
}

export type LegalPageDefinition = {
  key: string
  label: string
  livePath: string
  defaults: LegalPageContent
}

export const LEGAL_PAGE_DEFINITIONS: LegalPageDefinition[] = [
  { key: LEGAL_KVKK_PAGE_KEY, label: 'KVKK Aydınlatma Metni', livePath: '/kvkk-aydinlatma-metni', defaults: defaultLegalKvkkPage },
  { key: LEGAL_PRIVACY_PAGE_KEY, label: 'Gizlilik Politikası', livePath: '/gizlilik-politikasi', defaults: defaultLegalPrivacyPage },
  { key: LEGAL_COOKIE_PAGE_KEY, label: 'Çerez Politikası', livePath: '/cerez-politikasi', defaults: defaultLegalCookiePage },
  { key: LEGAL_CONSENT_PAGE_KEY, label: 'Açık Rıza Metni', livePath: '/acik-riza-metni', defaults: defaultLegalAcikRizaPage },
  { key: LEGAL_TERMS_PAGE_KEY, label: 'Kullanım Şartları', livePath: '/kullanim-sartlari', defaults: defaultLegalTermsPage },
]

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return fallback
}

function normalizeSection(section: Partial<LegalPageSection>, index: number, fallback?: LegalPageSection): LegalPageSection {
  const base = fallback ?? {
    id: `section-${index + 1}`,
    title: '',
    body: '',
    order: index,
    active: true,
    kind: 'default' as const,
  }

  return {
    id: section.id?.trim() || base.id,
    title: section.title?.trim() || base.title,
    body: typeof section.body === 'string' ? section.body : base.body,
    order: typeof section.order === 'number' ? section.order : index,
    active: parseBoolean(section.active, base.active),
    listItems: Array.isArray(section.listItems)
      ? section.listItems.map((item) => String(item).trim()).filter(Boolean)
      : base.listItems,
    kind: section.kind ?? base.kind ?? 'default',
    cookieCategory: section.cookieCategory ?? base.cookieCategory,
  }
}

export function mergeLegalPageContent(
  defaults: LegalPageContent,
  partial?: Partial<LegalPageContent> | null,
): LegalPageContent {
  if (!partial) return structuredClone(defaults)

  const fallbackSections = defaults.sections
  const incomingSections = Array.isArray(partial.sections) ? partial.sections : fallbackSections

  const sections = incomingSections
    .map((section, index) => normalizeSection(section, index, fallbackSections[index]))
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({ ...section, order: index }))

  return {
    enabled: parseBoolean(partial.enabled, defaults.enabled),
    title: partial.title?.trim() || defaults.title,
    description: partial.description?.trim() || defaults.description,
    updatedAtLabel: partial.updatedAtLabel?.trim() || defaults.updatedAtLabel,
    sections: sections.length ? sections : structuredClone(defaults.sections),
    seoTitle: partial.seoTitle?.trim() || defaults.seoTitle,
    seoDescription: partial.seoDescription?.trim() || defaults.seoDescription,
  }
}

export function activeLegalSections(content: LegalPageContent): LegalPageSection[] {
  return content.sections.filter((section) => section.active)
}

export function legalTocFromSections(sections: LegalPageSection[]) {
  return sections.map((section) => ({ id: section.id, label: section.title }))
}
