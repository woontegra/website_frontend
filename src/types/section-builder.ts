/** Section-based builder — panel ve public API ile uyumlu */

export type SectionSettings = {
  backgroundColor?: string
  gradient?: string
  /** CSS gradient: linear-gradient(to right, #color1, #color2) */
  gradientFrom?: string
  gradientTo?: string
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
  marginTop?: string
  marginBottom?: string
  borderRadius?: string
  /** full | boxed | narrow | wide (max-w-7xl) — container genişliği */
  containerWidth?: string
  textAlign?: 'left' | 'center' | 'right' | string
  /** Bölüm minimum yüksekliği (örn. hero: 85vh) */
  minHeight?: string
  /** Hero — grid satır/sütun aralığı (CSS length) */
  heroGridGap?: string
  heroColumnGap?: string
  /** Hero — başlık / alt başlık max genişlik */
  heroHeadlineMaxWidth?: string
  heroSubtitleMaxWidth?: string
  /** Hero — başlık ikinci satır gradient renkleri */
  heroGradientFrom?: string
  heroGradientVia?: string
  heroGradientTo?: string
  /** Eski — geriye dönük */
  padding?: string
  margin?: string
}

export type SectionStyle = {
  titleFontSize?: string
  titleFontWeight?: string
  titleColor?: string
  subtitleFontSize?: string
  subtitleColor?: string
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
}

/** Hero — tam genişlik arka plan; içerik genişliği bileşende max-w-7xl */
export const DEFAULT_HERO_SECTION_SETTINGS: SectionSettings & Record<string, unknown> = {
  paddingTop: '0',
  paddingBottom: '0',
  containerWidth: 'full',
}

export type HeroSectionContent = {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  image?: string
  imagePosition?: 'left' | 'right'
  imageSize?: 'small' | 'medium' | 'large' | 'custom'
  imageHeight?: string
  imageFit?: 'cover' | 'contain'
  /** Eski */
  imageUrl?: string
  cta1?: { text?: string; href?: string }
  cta2?: { text?: string; href?: string }
  bgType?: string
}

export type BrandItemContent = {
  title?: string
  description?: string
  image?: string
  link?: string
  name?: string
  logo?: string
  href?: string
  coverImage?: string
  tone?: string
}

export type BrandsSectionContent = {
  title?: string
  subtitle?: string
  badge?: string
  items?: BrandItemContent[]
  columns?: number
  gap?: string
  cardStyle?: 'shadow' | 'bordered' | 'minimal'
}

export type ServiceItemContent = {
  title?: string
  description?: string
  icon?: string
  link?: string
  href?: string
}

export type ServicesSectionContent = {
  title?: string
  description?: string
  items?: ServiceItemContent[]
  columns?: number
  iconSize?: string
}
