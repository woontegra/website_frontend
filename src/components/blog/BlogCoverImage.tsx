import { getBlogCategoryGradient } from '../../lib/blogCategoryStyle'

type BlogCoverImageProps = {
  src: string
  alt: string
  category: string
  className?: string
}

export function BlogCoverImage({ src, alt, category, className = '' }: BlogCoverImageProps) {
  const gradient = getBlogCategoryGradient(category)

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="sync"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  )
}
