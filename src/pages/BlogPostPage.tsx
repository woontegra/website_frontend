import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blog'
import { Badge } from '../components/ui/Badge'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="py-16 text-center">
        <p className="text-surface-600">Yazı bulunamadı.</p>
        <Link to="/blog" className="mt-4 inline-block text-accent-blue">← Bloga dön</Link>
      </div>
    )
  }

  return (
    <article className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/blog" className="text-sm text-surface-600 hover:text-heading mb-6 inline-block">← Blog</Link>
        <Badge variant="blue" className="mb-4">{post.category}</Badge>
        <h1 className="text-4xl font-bold text-heading">{post.title}</h1>
        <p className="mt-2 text-surface-500 text-sm">{post.date} {post.readTime && `· ${post.readTime}`}</p>
        <p className="mt-6 text-surface-600">{post.excerpt}</p>
        <div className="mt-8 prose prose max-w-none">
          <p className="text-surface-600">
            İçerik burada yer alacak. Gerçek blog için CMS veya MD dosyaları bağlanabilir.
          </p>
        </div>
      </div>
    </article>
  )
}
