import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { resolveImageUrl } from '../../lib/resolveImageUrl'

type SafeImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null
  alt: string
  fallbackClassName?: string
  fallbackText?: string
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  fallbackText = 'Görsel hazırlanıyor',
  onError,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const resolvedSrc = src ? resolveImageUrl(src) : ''
  const hadSource = Boolean(src?.trim())

  useEffect(() => {
    setHasError(false)
  }, [resolvedSrc])

  if (!resolvedSrc || hasError) {
    return (
      <div
        className={`flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500 ${fallbackClassName || className}`}
        role="img"
        aria-label={alt || fallbackText}
      >
        <ImageOff className="h-8 w-8 shrink-0 opacity-60" aria-hidden />
        <span className="text-sm font-medium">
          {hadSource ? 'Görsel bulunamadı' : fallbackText}
        </span>
      </div>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={(event) => {
        setHasError(true)
        onError?.(event)
      }}
      {...props}
    />
  )
}
