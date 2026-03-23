import type { ReactNode } from 'react'
import type { SectionSettings, SectionStyle } from '../../types/section-builder'
import {
  gradientClass,
  customGradientStyle,
  sectionOuterStyle,
  sectionContainerClass,
  sectionStyleVars,
} from '../../lib/sectionSettingsStyle'

export function mergeSectionContent(section: {
  content?: Record<string, unknown>
  props?: Record<string, unknown>}): Record<string, unknown> {
  return { ...(section.props ?? {}), ...(section.content ?? {}) }
}

type Props = {
  settings?: SectionSettings & Record<string, unknown>
  style?: SectionStyle & Record<string, unknown>
  children: ReactNode
  className?: string
}

/**
 * Bölüm düzeyi arka plan, gradient, padding, margin, hizalama (panelden gelen settings).
 * sectionStyle → CSS custom properties olarak içeriğe geçer.
 */
export function SectionSettingsWrapper({
  settings,
  style,
  children,
  className = '',
}: Props) {
  const s = settings ?? {}
  const outerStyle = sectionOuterStyle(s)
  const containerCls = sectionContainerClass(s)
  const styleVars = sectionStyleVars(style) as React.CSSProperties

  const gradPreset = gradientClass(typeof s.gradient === 'string' ? s.gradient : undefined)
  const customGrad = s.gradientFrom || s.gradientTo
    ? customGradientStyle(
        typeof s.gradientFrom === 'string' ? s.gradientFrom : undefined,
        typeof s.gradientTo === 'string' ? s.gradientTo : undefined
      )
    : undefined

  const bgOnly =
    s.backgroundColor &&
    typeof s.backgroundColor === 'string' &&
    (!s.gradient || s.gradient === 'none') &&
    !customGrad
      ? { backgroundColor: s.backgroundColor }
      : undefined

  const hasLayer = Boolean(gradPreset || customGrad || bgOnly)

  return (
    <section className={`relative ${className}`} style={outerStyle}>
      {hasLayer ? (
        <>
          <div
            className={`pointer-events-none absolute inset-0 ${gradPreset}`}
            style={customGrad || bgOnly}
            aria-hidden
          />
          <div
            className={`relative z-[1] w-full ${containerCls}`}
            style={Object.keys(styleVars).length > 0 ? styleVars : undefined}
          >
            {children}
          </div>
        </>
      ) : (
        <div
          className={`relative z-[1] w-full ${containerCls}`}
          style={Object.keys(styleVars).length > 0 ? styleVars : undefined}
        >
          {children}
        </div>
      )}
    </section>
  )
}
