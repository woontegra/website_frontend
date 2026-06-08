import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ImageSkeleton } from './ImageSkeleton'
import { buildBrandedAssetUrl } from '../../lib/siteBrandingUrl'
import { isValidImageSrc } from '../../lib/resolveImageUrl'

type SafeLogoProps = {
  src?: string | null
  /** API settings.logoUpdatedAt — aynı path ile upload sonrası cache kırılır */
  cacheVersion?: string | null
  alt?: string
  className?: string
  textClassName?: string
  width?: number
  height?: number
  heightPx?: number
  maxWidthPx?: number
  wrapperMinHeight?: number
  wrapperStyle?: CSSProperties
  imgStyle?: CSSProperties
  loading?: boolean
}

type LoadState = 'idle' | 'loading' | 'loaded' | 'error'

export function SafeLogo({
  src,
  cacheVersion,
  alt = 'Woontegra',
  className = 'block w-auto max-w-full object-contain object-left',
  textClassName = 'text-xl font-bold tracking-tight text-slate-900 min-[1200px]:text-2xl',
  width,
  height,
  heightPx,
  maxWidthPx,
  wrapperMinHeight,
  wrapperStyle,
  imgStyle,
  loading = false,
}: SafeLogoProps) {
  const resolvedSrc =
    !loading && isValidImageSrc(src) ? buildBrandedAssetUrl(src!.trim(), cacheVersion) : ''
  const [state, setState] = useState<LoadState>(resolvedSrc ? 'loading' : 'idle')
  const loadedSrcRef = useRef('')

  useEffect(() => {
    if (!resolvedSrc) {
      setState('idle')
      loadedSrcRef.current = ''
      return
    }
    if (loadedSrcRef.current === resolvedSrc) {
      setState('loaded')
      return
    }
    setState('loading')
  }, [resolvedSrc])

  const showText = loading || !resolvedSrc || state === 'error'
  const minWrapperHeight = wrapperMinHeight ?? heightPx ?? 48

  const resolvedImgStyle: CSSProperties = {
    ...imgStyle,
    ...(heightPx != null ? { height: `${heightPx}px` } : {}),
    ...(maxWidthPx != null ? { maxWidth: `${maxWidthPx}px` } : {}),
  }

  if (showText) {
    return (
      <span
        className={`inline-flex items-center ${textClassName}`}
        style={{ minHeight: minWrapperHeight, minWidth: '7rem', ...wrapperStyle }}
        aria-label={alt}
      >
        {loading ? (
          <ImageSkeleton className="h-10 w-32 rounded-lg" />
        ) : (
          alt
        )}
      </span>
    )
  }

  return (
    <span
      className="relative inline-flex items-center"
      style={{ minHeight: minWrapperHeight, ...wrapperStyle }}
    >
      {state !== 'loaded' ? (
        <ImageSkeleton className="absolute inset-0 h-full min-w-[7rem] rounded-lg" />
      ) : null}
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        style={resolvedImgStyle}
        className={`${className} transition-opacity duration-500 ease-out ${
          state === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        onLoad={() => {
          loadedSrcRef.current = resolvedSrc
          setState('loaded')
        }}
        onError={() => {
          loadedSrcRef.current = ''
          setState('error')
        }}
      />
    </span>
  )
}
