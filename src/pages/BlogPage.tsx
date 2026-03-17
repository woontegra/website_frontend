import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blog'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export function BlogPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Blog"
          subtitle="Teknoloji, yazılım, e-ticaret, marka tescil ve dijital büyüme üzerine yazılar."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="p-6 h-full block">
                <Badge variant="blue" className="mb-3">{post.category}</Badge>
                <h3 className="text-lg font-semibold text-heading">{post.title}</h3>
                <p className="mt-2 text-surface-600 text-sm line-clamp-2">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-surface-500">
                  <span>{post.date}</span>
                  {post.readTime && <span>· {post.readTime}</span>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
