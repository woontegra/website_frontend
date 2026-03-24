// Section Types
export type SectionType = 
  | 'hero' 
  | 'services' 
  | 'brands' 
  | 'why' 
  | 'process' 
  | 'cta'
  | 'text-content'
  | 'contact-info'
  | 'contact-form'
  | 'service-features'
  | 'faq-list'
  | 'blog-posts'

// Hero Section
export interface HeroSectionData {
  tag: string
  title: string
  subtitle: string
  button1Text: string
  button2Text: string
  image?: string
}

// Services Section
export interface ServiceItem {
  title: string
  description: string
  icon: string
}

export interface ServicesSectionData {
  title: string
  subtitle: string
  items: ServiceItem[]
}

// Brands Section
export interface BrandItem {
  name: string
  description: string
  image: string
}

export interface BrandsSectionData {
  title: string
  subtitle: string
  items: BrandItem[]
}

// Why Section
export interface WhyItem {
  title: string
  description: string
  icon: string
}

export interface WhySectionData {
  title: string
  subtitle: string
  items: WhyItem[]
}

// Process Section
export interface ProcessStep {
  title: string
  description: string
  number: number
}

export interface ProcessSectionData {
  title: string
  subtitle: string
  steps: ProcessStep[]
}

// CTA Section
export interface CTASectionData {
  title: string
  subtitle: string
  buttonText: string
}

// Text Content Section (for About, etc.)
export interface TextContentSectionData {
  title: string
  paragraphs: string[]
  highlight?: string
}

// Contact Info Section
export interface ContactInfoSectionData {
  email: string
  phone: string
  whatsapp?: string
  address: string
  mapEmbed?: string
}

// Contact Form Section
export interface ContactFormSectionData {
  title: string
  subtitle: string
  submitButtonText: string
}

// Service Features Section
export interface ServiceFeature {
  title: string
  description: string
  icon: string
}

export interface ServiceFeaturesSectionData {
  title: string
  subtitle: string
  features: ServiceFeature[]
}

// FAQ Section
export interface FAQItem {
  question: string
  answer: string
}

export interface FAQSectionData {
  title: string
  items: FAQItem[]
}

// Blog Posts Section
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  date: string
  featured?: boolean
}

export interface BlogPostsSectionData {
  title: string
  subtitle: string
  categories: string[]
  posts: BlogPost[]
}

// Union type for all section data
export type SectionData = 
  | HeroSectionData 
  | ServicesSectionData 
  | BrandsSectionData 
  | WhySectionData
  | ProcessSectionData
  | CTASectionData
  | TextContentSectionData
  | ContactInfoSectionData
  | ContactFormSectionData
  | ServiceFeaturesSectionData
  | FAQSectionData
  | BlogPostsSectionData

// Page Section
export interface PageSection {
  id: string
  type: SectionType
  data: SectionData
  order: number
}

// Page Data
export interface PageData {
  slug: string
  sections: PageSection[]
}
