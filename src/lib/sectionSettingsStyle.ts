import type { CSSProperties } from 'react'
import type { SectionSettings, SectionStyle } from '../types/section-builder'

const GRADIENT_CLASS: Record<string, string> = {
  none: '',
  warm: 'bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-rose-100/70',
  cool: 'bg-gradient-to-br from-slate-100/90 via-sky-50/50 to-emerald-50/60',
  dark: 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950',
  brand: 'bg-gradient-to-br from-indigo-50/90 via-violet-50/70 to-fuchsia-50/60',
  slate: 'bg-gradient-to-b from-slate-50 via-slate-100/80 to-slate-50',
}

export function gradientClass(gradient?: string): string {
  if (!gradient || gradient === 'none' || gradient === 'custom') return ''
  return GRADIENT_CLASS[gradient] ?? ''
}

/** GradientFrom/To ile özel gradient — inline style döner */
export function customGradientStyle(
  gradientFrom?: string,
  gradientTo?: string
): CSSProperties {
  if (!gradientFrom && !gradientTo) return {}
  const from = gradientFrom || '#3b82f6'
  const to = gradientTo || '#10b981'
  return {
    background: `linear-gradient(to right, ${from}, ${to})`,
  }
}

export function sectionOuterStyle(
  settings?: SectionSettings | Record<string, unknown>
): CSSProperties {
  const s = settings as SectionSettings | undefined
  if (!s) return {}
  const style: CSSProperties = {}
  if (s.paddingTop) style.paddingTop = s.paddingTop
  if (s.paddingBottom) style.paddingBottom = s.paddingBottom
  if (s.paddingLeft) style.paddingLeft = s.paddingLeft
  if (s.paddingRight) style.paddingRight = s.paddingRight
  if (!style.paddingTop && !style.paddingBottom && !style.paddingLeft && !style.paddingRight && s.padding) {
    style.padding = s.padding
  }
  if (s.marginTop) style.marginTop = s.marginTop
  if (s.marginBottom) style.marginBottom = s.marginBottom
  if (!style.marginTop && !style.marginBottom && s.margin) style.margin = s.margin
  if (s.borderRadius) style.borderRadius = s.borderRadius
  if (s.minHeight) style.minHeight = s.minHeight
  if (s.textAlign === 'left' || s.textAlign === 'center' || s.textAlign === 'right') {
    style.textAlign = s.textAlign
  }
  return style
}

/** Hero iç layout — font, spacing, gradient parçaları tek kaynak (settings + style) */
export function heroSectionStyleVars(
  settings?: SectionSettings | Record<string, unknown>,
  style?: SectionStyle | Record<string, unknown>
): CSSProperties {
  const s = (settings ?? {}) as SectionSettings & Record<string, unknown>
  const baseVars = sectionStyleVars(style) as Record<string, string>

  const vars: Record<string, string> = { ...baseVars }

  if (!vars['--section-title-font-size']) {
    vars['--section-title-font-size'] = 'clamp(1.875rem, 4vw, 3rem)'
  }
  if (!vars['--section-title-font-weight']) {
    vars['--section-title-font-weight'] = '600'
  }
  if (!vars['--section-title-color']) {
    vars['--section-title-color'] = '#0f172a'
  }
  if (!vars['--section-subtitle-font-size']) {
    vars['--section-subtitle-font-size'] = '1.125rem'
  }
  if (!vars['--section-subtitle-color']) {
    vars['--section-subtitle-color'] = '#475569'
  }
  if (!vars['--section-text-color']) {
    vars['--section-text-color'] = '#475569'
  }
  if (!vars['--section-button-color']) {
    vars['--section-button-color'] = '#2563eb'
  }
  if (!vars['--section-button-text-color']) {
    vars['--section-button-text-color'] = '#ffffff'
  }

  vars['--hero-grid-gap'] = String(s.heroGridGap ?? 'clamp(2rem, 4vw, 3rem)')
  vars['--hero-column-gap'] = String(s.heroColumnGap ?? 'clamp(2rem, 5vw, 4rem)')
  vars['--hero-headline-max-width'] = String(s.heroHeadlineMaxWidth ?? '36rem')
  vars['--hero-subtitle-max-width'] = String(s.heroSubtitleMaxWidth ?? '34.375rem')
  vars['--hero-cta-row-gap'] = String((s as Record<string, unknown>).heroCtaRowGap ?? '1rem')
  vars['--hero-badge-row-gap'] = String((s as Record<string, unknown>).heroBadgeRowGap ?? '0.75rem')
  vars['--hero-content-margin-top'] = String((s as Record<string, unknown>).heroContentMarginTop ?? '1.5rem')
  vars['--hero-badges-margin-top'] = String((s as Record<string, unknown>).heroBadgesMarginTop ?? '2.5rem')
  vars['--hero-gradient-from'] = String(s.heroGradientFrom ?? '#2563eb')
  vars['--hero-gradient-via'] = String(s.heroGradientVia ?? '#3b82f6')
  vars['--hero-gradient-to'] = String(s.heroGradientTo ?? '#10b981')

  const out: CSSProperties = {}
  for (const [k, v] of Object.entries(vars)) {
    ;(out as Record<string, string>)[k] = v
  }
  return out
}

export function sectionContainerClass(
  settings?: SectionSettings | Record<string, unknown>
): string {
  const s = settings as SectionSettings | undefined
  const w = String(s?.containerWidth ?? '')
  if (w === 'full') return 'max-w-none w-full'
  if (w === 'narrow') return 'max-w-4xl mx-auto'
  if (w === 'wide') return 'max-w-7xl mx-auto w-full'
  return 'max-w-[1200px] mx-auto'
}

export function sectionHasVisualBackground(
  settings?: SectionSettings | Record<string, unknown>
): boolean {
  const s = settings as SectionSettings | undefined
  if (!s) return false
  const g = String(s.gradient ?? '')
  const custom = s.gradientFrom || s.gradientTo
  const bg = String(s.backgroundColor ?? '').trim()
  if (g && g !== 'none') return true
  if (custom) return true
  if (bg && bg !== 'transparent') return true
  return false
}

/** SectionStyle → CSS custom properties objesi */
export function sectionStyleVars(
  style?: SectionStyle | Record<string, unknown>
): Record<string, string> {
  const st = style as SectionStyle | undefined
  if (!st) return {}
  const vars: Record<string, string> = {}
  if (st.titleFontSize) vars['--section-title-font-size'] = st.titleFontSize
  if (st.titleFontWeight) vars['--section-title-font-weight'] = st.titleFontWeight
  if (st.titleColor) vars['--section-title-color'] = st.titleColor
  if (st.subtitleFontSize) vars['--section-subtitle-font-size'] = st.subtitleFontSize
  if (st.subtitleColor) vars['--section-subtitle-color'] = st.subtitleColor
  if (st.textColor) vars['--section-text-color'] = st.textColor
  if (st.buttonColor) vars['--section-button-color'] = st.buttonColor
  if (st.buttonTextColor) vars['--section-button-text-color'] = st.buttonTextColor
  return vars
}
