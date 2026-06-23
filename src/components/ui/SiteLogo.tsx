import { useState, type CSSProperties } from 'react'
import { HEADER_LOGO_ALT, HEADER_LOGO_WIDTH } from '../../config/siteLogo'
import { useSiteSettings } from '../../contexts/SiteSettingsContext'
import {
  clampLogoHeight,
  DEFAULT_NAVBAR_LOGO_HEIGHT,
} from '../../lib/logoSize'
import woontegraLogo from '../../assets/logos/woontegra-logo.png'

type SiteLogoPlacement = 'navbar' | 'footer' | 'inline'

type SiteLogoProps = {
  placement?: SiteLogoPlacement
  className?: string
  width?: number
  heightPx?: number
}

const SITE_LOGO_SRC = woontegraLogo

/** Geniş PNG (3.2:1) — genişlikten ölçeklenir (~52px mobil / ~62px masaüstü yükseklik). */
const NAVBAR_LOGO_WIDTH_MOBILE = 168
const FOOTER_LOGO_WIDTH = 180

function LogoTextFallback({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={`inline-flex items-center text-xl font-bold tracking-tight text-slate-900 min-[1200px]:text-2xl ${className ?? ''}`}
      style={style}
      aria-label={HEADER_LOGO_ALT}
    >
      Woontegra
    </span>
  )
}

/** Kurumsal site logosu — src/assets/logos/woontegra-logo.png, yükleme hatasında metin fallback. */
export function SiteLogo({
  placement = 'inline',
  className,
  width = HEADER_LOGO_WIDTH,
  heightPx,
}: SiteLogoProps) {
  const { navbarLogoHeight } = useSiteSettings()
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    if (placement === 'navbar') {
      return (
        <LogoTextFallback
          className={className}
          style={{ minHeight: `${NAVBAR_LOGO_WIDTH_MOBILE / 3.2}px` }}
        />
      )
    }
    if (placement === 'footer') {
      return (
        <LogoTextFallback
          className={className}
          style={{ minHeight: `${FOOTER_LOGO_WIDTH / 3.2}px` }}
        />
      )
    }
    const inlineH = clampLogoHeight(heightPx ?? navbarLogoHeight, DEFAULT_NAVBAR_LOGO_HEIGHT)
    return <LogoTextFallback className={className} style={{ minHeight: `${inlineH}px` }} />
  }

  if (placement === 'navbar') {
    return (
      <img
        src={SITE_LOGO_SRC}
        alt={HEADER_LOGO_ALT}
        width={width}
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        className={`block h-auto w-[min(168px,46vw)] object-contain object-left min-[1200px]:w-[200px] ${className ?? ''}`}
        onError={() => setImageError(true)}
      />
    )
  }

  if (placement === 'footer') {
    return (
      <img
        src={SITE_LOGO_SRC}
        alt={HEADER_LOGO_ALT}
        width={width}
        loading="eager"
        className={`block h-auto object-contain object-left ${className ?? ''}`}
        style={{ width: `${FOOTER_LOGO_WIDTH}px`, maxWidth: '100%' }}
        onError={() => setImageError(true)}
      />
    )
  }

  const inlineH = clampLogoHeight(heightPx ?? navbarLogoHeight, DEFAULT_NAVBAR_LOGO_HEIGHT)
  return (
    <img
      src={SITE_LOGO_SRC}
      alt={HEADER_LOGO_ALT}
      width={width}
      loading="eager"
      className={className ?? 'block w-auto object-contain object-left'}
      style={{ height: `${inlineH}px` }}
      onError={() => setImageError(true)}
    />
  )
}
