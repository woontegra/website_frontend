import { useEffect, useRef, useState } from 'react'
import { ImageSkeleton } from './ImageSkeleton'
import { isValidImageSrc, resolveImageUrl } from '../../lib/resolveImageUrl'

type SafeImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null
  alt: string
  wrapperClassName?: string
  skeletonClassName?: string
  fallbackClassName?: string
  fallbackText?: string
  showErrorIcon?: boolean
}

type LoadState = 'idle' | 'loading' | 'loaded' | 'error'

export function SafeImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  skeletonClassName = '',
  fallbackClassName = '',
  fallbackText = 'Görsel hazırlanıyor',
  showErrorIcon = false,
  onError,
  onLoad,
  ...props
}: SafeImageProps) {
  const resolvedSrc = isValidImageSrc(src) ? resolveImageUrl(src) : ''
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

  if (!resolvedSrc) {
    return (
      <div
        className={`relative w-full ${wrapperClassName}`}
        role="img"
        aria-label={alt || fallbackText}
      >
        <ImageSkeleton className={`min-h-[120px] w-full ${skeletonClassName}`} />
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div
        className={`relative flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-100 to-slate-50 px-4 py-8 text-center ${fallbackClassName || className}`}
        role="img"
        aria-label={alt || fallbackText}
      >
        {showErrorIcon ? (
          <span className="text-2xl opacity-40" aria-hidden>
            ◌
          </span>
        ) : null}
        <span className="text-sm font-medium text-slate-500">{fallbackText}</span>
      </div>
    )
  }

  const showSkeleton = state !== 'loaded'

  return (
    <div className={`relative w-full overflow-hidden ${wrapperClassName}`}>
      {showSkeleton ? (
        <ImageSkeleton
          className={`absolute inset-0 z-[1] min-h-full w-full ${skeletonClassName}`}
          rounded={false}
        />
      ) : null}
      <img
        src={resolvedSrc}
        alt={alt}
        className={`${className} transition-opacity duration-500 ease-out ${
          state === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={(event) => {
          loadedSrcRef.current = resolvedSrc
          setState('loaded')
          onLoad?.(event)
        }}
        onError={(event) => {
          loadedSrcRef.current = ''
          setState('error')
          onError?.(event)
        }}
        {...props}
      />
    </div>
  )
}
