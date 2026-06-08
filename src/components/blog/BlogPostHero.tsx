import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getBlogCategoryGradient } from '../../lib/blogCategoryStyle'
import { isValidImageSrc } from '../../lib/resolveImageUrl'

type BlogPostHeroProps = {
  image?: string | null
  title: string
  category: string
  date: string
  authorName?: string
  readTime?: string
}

export function BlogPostHero({
  image,
  title,
  category,
  date,
  authorName,
  readTime = '8 dk okuma',
}: BlogPostHeroProps) {
  const gradient = getBlogCategoryGradient(category)
  const showImage = image && isValidImageSrc(image)

  return (
    <section className={`relative min-h-[22rem] overflow-hidden bg-gradient-to-br md:min-h-[26rem] ${gradient}`}>
      {showImage ? (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="sync"
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

      <div className="container relative z-10 mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-end px-4 pb-10 pt-8 md:min-h-[26rem] md:pb-12">
        <Link
          to="/blog"
          className="mb-6 inline-flex w-fit items-center rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Blog'a Dön
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            {category}
          </span>
          <span className="text-sm text-white/80">{date}</span>
          {authorName ? (
            <>
              <span className="text-white/50">·</span>
              <span className="text-sm text-white/80">{authorName}</span>
            </>
          ) : null}
          <span className="text-white/50">·</span>
          <span className="text-sm text-white/80">{readTime}</span>
        </div>

        <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h1>
      </div>
    </section>
  )
}
