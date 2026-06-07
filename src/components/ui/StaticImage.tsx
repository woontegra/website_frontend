import { useState } from 'react'

type StaticImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
}

/** Bundle/public asset görseli — hata olursa img gizlenir (kırık ikon yok). */
export function StaticImage({ src, alt, className = '', onError, ...props }: StaticImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return null

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      decoding="sync"
      onError={(event) => {
        setFailed(true)
        onError?.(event)
      }}
      {...props}
    />
  )
}
