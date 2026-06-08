import { blogCoverBySlug, frontendImages } from '../data/frontendImages'
import { isValidImageSrc } from './resolveImageUrl'

export const BLOG_COVER_IMAGE_OPTIONS = [
  { key: 'none', label: 'Görsel yok' },
  { key: 'default', label: 'Varsayılan' },
  { key: 'digitalTransformation', label: 'Dijital Dönüşüm' },
  { key: 'saasGuide', label: 'SaaS Rehberi' },
  { key: 'ecommerceOptimization', label: 'E-Ticaret' },
  { key: 'trademark', label: 'Marka Tescil' },
  { key: 'webTech', label: 'Web Teknolojileri' },
  { key: 'digitalMarketing', label: 'Dijital Pazarlama' },
  { key: 'apiDesign', label: 'API Tasarımı' },
] as const

const BLOG_IMAGE_MAP: Record<string, string> = {
  default: frontendImages.blog.default,
  digitalTransformation: frontendImages.blog.digitalTransformation,
  saasGuide: frontendImages.blog.saasGuide,
  ecommerceOptimization: frontendImages.blog.ecommerceOptimization,
  trademark: frontendImages.blog.trademark,
  webTech: frontendImages.blog.webTech,
  digitalMarketing: frontendImages.blog.digitalMarketing,
  apiDesign: frontendImages.blog.apiDesign,
}

export function resolveBlogCoverImage(imageKey?: string, slug?: string): string | null {
  if (imageKey === 'none') return null

  if (imageKey && imageKey !== 'default' && BLOG_IMAGE_MAP[imageKey]) {
    const src = BLOG_IMAGE_MAP[imageKey]
    return isValidImageSrc(src) ? src : null
  }

  if (slug && blogCoverBySlug[slug]) {
    const src = blogCoverBySlug[slug]
    return isValidImageSrc(src) ? src : null
  }

  if (!imageKey || imageKey === 'default') {
    const src = BLOG_IMAGE_MAP.default
    return isValidImageSrc(src) ? src : null
  }

  return null
}
