import { useEffect, useState } from 'react'
import { resolveImageUrl } from '../../lib/resolveImageUrl'
import { getBlogCategoryGradient } from '../../lib/blogCategoryStyle'

type BlogCoverImageProps = {
  src?: string | null
  alt: string
  category: string
  className?: string
}

export function BlogCoverImage({ src, alt, category, className = '' }: BlogCoverImageProps) {
  const [failed, setFailed] = useState(false)
  const resolvedSrc = src ? resolveImageUrl(src) : ''
  const gradient = getBlogCategoryGradient(category)

  useEffect(() => {
    setFailed(false)
  }, [resolvedSrc])

  const showImage = Boolean(resolvedSrc) && !failed

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      {showImage ? (
        <img
          src={resolvedSrc}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.12),transparent_65%)]">
          <span className="px-4 text-center text-sm font-semibold uppercase tracking-wider text-white/80">
            {category}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  )
}
