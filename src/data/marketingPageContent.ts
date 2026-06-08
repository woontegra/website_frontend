export type MarketingPageContent = {
  enabled: boolean
  showInMenu: boolean
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  highlight1: string
  highlight2: string
  sectionEyebrow: string
  sectionTitle: string
  sectionDescription: string
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
  ctaButtonLink: string
  ctaSecondaryButtonText: string
  ctaSecondaryButtonLink: string
  seoTitle: string
  seoDescription: string
}

export function mergeMarketingPageContent(
  defaults: MarketingPageContent,
  partial?: Partial<MarketingPageContent> | null,
): MarketingPageContent {
  if (!partial) return { ...defaults }
  return {
    enabled: partial.enabled ?? defaults.enabled,
    showInMenu: partial.showInMenu ?? defaults.showInMenu,
    heroEyebrow: partial.heroEyebrow?.trim() || defaults.heroEyebrow,
    heroTitle: partial.heroTitle?.trim() || defaults.heroTitle,
    heroDescription: partial.heroDescription?.trim() || defaults.heroDescription,
    highlight1: partial.highlight1?.trim() || defaults.highlight1,
    highlight2: partial.highlight2?.trim() || defaults.highlight2,
    sectionEyebrow: partial.sectionEyebrow?.trim() || defaults.sectionEyebrow,
    sectionTitle: partial.sectionTitle?.trim() || defaults.sectionTitle,
    sectionDescription: partial.sectionDescription?.trim() || defaults.sectionDescription,
    ctaTitle: partial.ctaTitle?.trim() || defaults.ctaTitle,
    ctaDescription: partial.ctaDescription?.trim() || defaults.ctaDescription,
    ctaButtonText: partial.ctaButtonText?.trim() || defaults.ctaButtonText,
    ctaButtonLink: partial.ctaButtonLink?.trim() || defaults.ctaButtonLink,
    ctaSecondaryButtonText: partial.ctaSecondaryButtonText?.trim() || defaults.ctaSecondaryButtonText,
    ctaSecondaryButtonLink: partial.ctaSecondaryButtonLink?.trim() || defaults.ctaSecondaryButtonLink,
    seoTitle: partial.seoTitle?.trim() || defaults.seoTitle,
    seoDescription: partial.seoDescription?.trim() || defaults.seoDescription,
  }
}
