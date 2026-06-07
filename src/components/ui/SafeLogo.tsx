import { useEffect, useRef, useState } from 'react'
import { ImageSkeleton } from './ImageSkeleton'
import { isValidImageSrc, resolveImageUrl } from '../../lib/resolveImageUrl'

type SafeLogoProps = {
  src?: string | null
  alt?: string
  className?: string
  textClassName?: string
  loading?: boolean
}

type LoadState = 'idle' | 'loading' | 'loaded' | 'error'

export function SafeLogo({
  src,
  alt = 'Woontegra',
  className = 'h-14 w-auto max-w-full object-contain min-[1200px]:h-[4.25rem]',
  textClassName = 'text-xl font-bold tracking-tight text-slate-900 min-[1200px]:text-2xl',
  loading = false,
}: SafeLogoProps) {
  const resolvedSrc = !loading && isValidImageSrc(src) ? resolveImageUrl(src) : ''
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

  if (showText) {
    return (
      <span
        className={`inline-flex min-h-[3.5rem] min-w-[7rem] items-center ${textClassName}`}
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
    <span className="relative inline-flex min-h-[3.5rem] items-center">
      {state !== 'loaded' ? (
        <ImageSkeleton className="absolute inset-0 h-full min-w-[7rem] rounded-lg" />
      ) : null}
      <img
        src={resolvedSrc}
        alt={alt}
        className={`${className} transition-opacity duration-500 ease-out ${
          state === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
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
