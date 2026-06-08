import { useEffect, useState, type CSSProperties } from 'react'
import { DEFAULT_SITE_LOGO, fetchPublicSiteSettings } from '../../api/siteSettings'
import { HEADER_LOGO_ALT, HEADER_LOGO_WIDTH } from '../../config/siteLogo'
import { useSiteSettings } from '../../contexts/SiteSettingsContext'
import {
  clampLogoHeight,
  DEFAULT_FOOTER_LOGO_HEIGHT,
  DEFAULT_MOBILE_LOGO_HEIGHT,
  DEFAULT_NAVBAR_LOGO_HEIGHT,
} from '../../lib/logoSize'
import { SafeLogo } from './SafeLogo'

type SiteLogoPlacement = 'navbar' | 'footer' | 'inline'

type SiteLogoProps = {
  placement?: SiteLogoPlacement
  className?: string
  textClassName?: string
  width?: number
  heightPx?: number
}

export function SiteLogo({
  placement = 'inline',
  className,
  textClassName,
  width = HEADER_LOGO_WIDTH,
  heightPx,
}: SiteLogoProps) {
  const context = useSiteSettings()
  const [fallback, setFallback] = useState({
    logo: DEFAULT_SITE_LOGO,
    logoUpdatedAt: '',
    navbarLogoHeight: DEFAULT_NAVBAR_LOGO_HEIGHT,
    footerLogoHeight: DEFAULT_FOOTER_LOGO_HEIGHT,
    mobileLogoHeight: DEFAULT_MOBILE_LOGO_HEIGHT,
    loaded: false,
  })

  useEffect(() => {
    if (context.loaded) return
    let cancelled = false
    void fetchPublicSiteSettings().then((data) => {
      if (cancelled) return
      setFallback({
        logo: data.logo?.trim() || DEFAULT_SITE_LOGO,
        logoUpdatedAt: data.logoUpdatedAt?.trim() || '',
        navbarLogoHeight: data.navbarLogoHeight,
        footerLogoHeight: data.footerLogoHeight,
        mobileLogoHeight: data.mobileLogoHeight,
        loaded: true,
      })
    })
    return () => {
      cancelled = true
    }
  }, [context.loaded])

  const logo = context.loaded ? context.logo : fallback.logo
  const logoUpdatedAt = context.loaded ? context.logoUpdatedAt : fallback.logoUpdatedAt
  const navbarHeight = context.loaded ? context.navbarLogoHeight : fallback.navbarLogoHeight
  const footerHeight = context.loaded ? context.footerLogoHeight : fallback.footerLogoHeight
  const mobileHeight = context.loaded ? context.mobileLogoHeight : fallback.mobileLogoHeight
  const loading = context.loaded ? false : !fallback.loaded

  if (placement === 'navbar') {
    const desktopH = clampLogoHeight(navbarHeight, DEFAULT_NAVBAR_LOGO_HEIGHT)
    const mobileH = clampLogoHeight(mobileHeight, DEFAULT_MOBILE_LOGO_HEIGHT)
    const cssVars = {
      '--logo-h-mobile': `${mobileH}px`,
      '--logo-h-desktop': `${desktopH}px`,
    } as CSSProperties

    return (
      <SafeLogo
        src={logo || DEFAULT_SITE_LOGO}
        cacheVersion={logoUpdatedAt}
        alt={HEADER_LOGO_ALT}
        width={width}
        className={`block w-auto max-w-[200px] object-contain object-left min-[1200px]:max-w-[280px] h-[var(--logo-h-mobile)] min-[1200px]:h-[var(--logo-h-desktop)] ${className ?? ''}`}
        textClassName={textClassName}
        wrapperMinHeight={mobileH}
        wrapperStyle={cssVars}
        loading={loading}
      />
    )
  }

  if (placement === 'footer') {
    const footerH = clampLogoHeight(footerHeight, DEFAULT_FOOTER_LOGO_HEIGHT)
    return (
      <SafeLogo
        src={logo || DEFAULT_SITE_LOGO}
        cacheVersion={logoUpdatedAt}
        alt={HEADER_LOGO_ALT}
        width={width}
        heightPx={footerH}
        maxWidthPx={200}
        className={`block w-auto object-contain object-left ${className ?? ''}`}
        textClassName={textClassName}
        wrapperMinHeight={footerH}
        loading={loading}
      />
    )
  }

  const inlineH = clampLogoHeight(heightPx ?? navbarHeight, DEFAULT_NAVBAR_LOGO_HEIGHT)
  return (
    <SafeLogo
      src={logo || DEFAULT_SITE_LOGO}
      cacheVersion={logoUpdatedAt}
      alt={HEADER_LOGO_ALT}
      width={width}
      heightPx={inlineH}
      className={className ?? 'block w-auto object-contain object-left'}
      textClassName={textClassName}
      wrapperMinHeight={inlineH}
      loading={loading}
    />
  )
}
