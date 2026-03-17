export interface CmsSectionItem {
  id: string
  title: string | null
  description: string | null
  icon: string | null
  image: string | null
  extraData: Record<string, unknown> | null
  order: number
}

export interface CmsSection {
  id: string
  type: string
  title: string | null
  content: Record<string, unknown> | null
  order: number
  items: CmsSectionItem[]
}

export interface CmsFaq {
  id: string
  question: string
  answer: string
  order: number
}

export interface CmsPage {
  id: string
  slug: string
  title: string
  sections: CmsSection[]
  faqs: CmsFaq[]
}
