import { getBlogCategoryGradient } from '../../lib/blogCategoryStyle'
import { isValidImageSrc } from '../../lib/resolveImageUrl'

type BlogCoverImageProps = {
  src?: string | null
  alt: string
  category: string
  className?: string
}

export function BlogCoverImage({ src, alt, category, className = '' }: BlogCoverImageProps) {
  const gradient = getBlogCategoryGradient(category)
  const showImage = src && isValidImageSrc(src)

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  )
}
