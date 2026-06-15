import { useEffect, useState } from 'react'
import { resolveAssetUrl } from '../../lib/resolveAssetUrl'

type MediaThumbProps = {
  url: string | null | undefined
  fileType: string
  className?: string
  alt?: string
}

/** Katalog medya: IMAGE için küçük önizleme; hata veya dosya tipinde placeholder */
export function MediaThumb({ url, fileType, className = 'h-14 w-20', alt = '' }: MediaThumbProps) {
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    setBroken(false)
  }, [url])

  if (fileType !== 'IMAGE') {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-100 text-[10px] font-semibold uppercase leading-tight text-slate-600 ${className}`}
        aria-hidden
      >
        {fileType === 'DOWNLOAD' ? 'DL' : fileType === 'DOCUMENT' ? 'PDF' : fileType.slice(0, 3)}
      </div>
    )
  }

  const src = resolveAssetUrl(url)
  if (!src || broken) {
    return (
      <div
        className={`flex shrink-0 flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 px-1 text-center text-[10px] font-medium leading-tight text-slate-500 ${className}`}
        role="img"
        aria-label="Görsel yüklenemedi"
      >
        Görsel yüklenemedi
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`shrink-0 rounded border border-slate-200 object-cover ${className}`}
      onError={() => setBroken(true)}
    />
  )
}
