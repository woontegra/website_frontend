export interface NavLink {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export type ServiceCategory = 'yazilim' | 'e-ticaret' | 'danismanlik' | 'marka-patent' | 'diger'

export interface Service {
  id: string
  title: string
  slug: string
  shortDescription: string
  icon?: string
  features?: string[]
  category?: ServiceCategory
}

export interface SubBrand {
  id: string
  name: string
  description: string
  href: string
  image?: string
}

export interface FAQItem {
  question: string
  answer: string
  category?: string
}
