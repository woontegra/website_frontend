import { blogPostContent } from './blogPostContent'
import { normalizeBlogSlug } from '../lib/blogSlug'

export const BLOG_POSTS_KEY = 'blogPosts'

export type BlogPostStatus = 'draft' | 'published'

export type BlogPostItem = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  status: BlogPostStatus
  publishedAt: string
  updatedAt: string
  authorName: string
  seoTitle: string
  seoDescription: string
  order: number
  featured: boolean
  active: boolean
  imageKey: string
}

export type BlogPostsBundle = {
  categories: string[]
  posts: BlogPostItem[]
}

const DEFAULT_CATEGORIES = ['Tümü', 'Yazılım', 'E-Ticaret', 'SaaS', 'Marka & Patent', 'Dijital Büyüme']

const SLUG_META: Array<{
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  imageKey: string
  date: string
  featured?: boolean
  status?: BlogPostStatus
}> = [
  {
    id: '1',
    slug: 'dijital-donusum-rehberi',
    title: 'Dijital Dönüşüm Rehberi: İşletmenizi Geleceğe Taşıyın',
    excerpt: 'Dijital dönüşüm sadece teknoloji değil, iş yapış şeklinizi değiştirmektir.',
    category: 'Dijital Büyüme',
    imageKey: 'digitalTransformation',
    date: '2026-03-20',
    featured: true,
  },
  {
    id: '2',
    slug: 'saas-urun-gelistirme-rehberi',
    title: 'SaaS Ürün Geliştirme Rehberi',
    excerpt: 'Başarılı bir SaaS ürünü geliştirmek için bilmeniz gereken temel adımlar.',
    category: 'SaaS',
    imageKey: 'saasGuide',
    date: '2026-03-15',
  },
  {
    id: '3',
    slug: 'e-ticaret-optimizasyonu',
    title: 'E-Ticaret Optimizasyonu',
    excerpt: 'Dönüşüm oranlarını artırmak için uygulanabilir stratejiler.',
    category: 'E-Ticaret',
    imageKey: 'ecommerceOptimization',
    date: '2026-03-12',
  },
  {
    id: '4',
    slug: 'marka-tescil-sureci',
    title: 'Marka Tescil Süreci',
    excerpt: 'Markanızı koruma altına almak için izlemeniz gereken adımlar.',
    category: 'Marka & Patent',
    imageKey: 'trademark',
    date: '2026-03-10',
  },
  {
    id: '5',
    slug: 'modern-web-teknolojileri',
    title: 'Modern Web Teknolojileri',
    excerpt: 'Güncel web geliştirme araçları ve framework seçimi.',
    category: 'Yazılım',
    imageKey: 'webTech',
    date: '2026-03-08',
  },
  {
    id: '6',
    slug: 'dijital-pazarlama-stratejileri',
    title: 'Dijital Pazarlama Stratejileri',
    excerpt: 'Online varlığınızı güçlendirmek için etkili yöntemler.',
    category: 'Dijital Büyüme',
    imageKey: 'digitalMarketing',
    date: '2026-03-05',
  },
  {
    id: '7',
    slug: 'api-tasarimi-best-practices',
    title: 'API Tasarımı Best Practices',
    excerpt: 'Ölçeklenebilir ve güvenli API geliştirme prensipleri.',
    category: 'Yazılım',
    imageKey: 'apiDesign',
    date: '2026-03-03',
  },
  {
    id: 'draft-internal',
    slug: 'taslak-icerik-yonetimi-rehberi',
    title: 'Taslak İçerik Yönetimi Rehberi',
    excerpt: 'Bu yazı yalnızca taslak durumundadır ve public listede görünmemelidir.',
    category: 'Yazılım',
    imageKey: 'default',
    date: '2026-06-01',
    status: 'draft',
  },
]

function buildDefaultPost(meta: (typeof SLUG_META)[number], order: number): BlogPostItem {
  const normalizedSlug = normalizeBlogSlug(meta.slug)
  const html = blogPostContent[normalizedSlug]?.trim() ?? `<p>${meta.excerpt}</p>`
  const status = meta.status ?? 'published'

  return {
    id: meta.id,
    title: meta.title,
    slug: meta.slug,
    excerpt: meta.excerpt,
    content: html,
    category: meta.category,
    tags: [],
    status,
    publishedAt: meta.date,
    updatedAt: meta.date,
    authorName: 'Woontegra',
    seoTitle: `${meta.title} | Woontegra`,
    seoDescription: meta.excerpt,
    order,
    featured: meta.featured ?? false,
    active: true,
    imageKey: meta.imageKey,
  }
}

export const defaultBlogPostsBundle: BlogPostsBundle = {
  categories: DEFAULT_CATEGORIES,
  posts: SLUG_META.map((meta, index) => buildDefaultPost(meta, index)),
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return fallback
}

function normalizePost(post: Partial<BlogPostItem>, index: number, fallback?: BlogPostItem): BlogPostItem {
  const base = fallback ?? {
    id: `post-${index + 1}`,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Yazılım',
    tags: [],
    status: 'draft' as const,
    publishedAt: '',
    updatedAt: '',
    authorName: 'Woontegra',
    seoTitle: '',
    seoDescription: '',
    order: index,
    featured: false,
    active: true,
    imageKey: 'default',
  }

  return {
    id: post.id?.trim() || base.id,
    title: post.title?.trim() || base.title,
    slug: post.slug?.trim() || base.slug,
    excerpt: typeof post.excerpt === 'string' ? post.excerpt : base.excerpt,
    content: typeof post.content === 'string' ? post.content : base.content,
    category: post.category?.trim() || base.category,
    tags: Array.isArray(post.tags)
      ? post.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : base.tags,
    status: post.status === 'published' || post.status === 'draft' ? post.status : base.status,
    publishedAt: post.publishedAt?.trim() || base.publishedAt,
    updatedAt: post.updatedAt?.trim() || base.updatedAt,
    authorName: post.authorName?.trim() || base.authorName,
    seoTitle: post.seoTitle?.trim() || base.seoTitle,
    seoDescription: post.seoDescription?.trim() || base.seoDescription,
    order: typeof post.order === 'number' ? post.order : index,
    featured: parseBoolean(post.featured, base.featured),
    active: parseBoolean(post.active, base.active),
    imageKey: post.imageKey?.trim() || base.imageKey,
  }
}

export function mergeBlogPostsBundle(
  defaults: BlogPostsBundle,
  partial?: Partial<BlogPostsBundle> | null,
): BlogPostsBundle {
  if (!partial) return structuredClone(defaults)

  const fallbackPosts = defaults.posts
  const incomingPosts = Array.isArray(partial.posts) ? partial.posts : fallbackPosts

  const posts = incomingPosts
    .map((post, index) => normalizePost(post, index, fallbackPosts[index]))
    .sort((a, b) => a.order - b.order)
    .map((post, index) => ({ ...post, order: index }))

  const categories = Array.isArray(partial.categories) && partial.categories.length
    ? partial.categories.map((c) => String(c).trim()).filter(Boolean)
    : defaults.categories

  return {
    categories: categories.length ? categories : defaults.categories,
    posts: posts.length ? posts : structuredClone(defaults.posts),
  }
}

export function isPublicBlogPost(post: BlogPostItem): boolean {
  return post.active && post.status === 'published' && Boolean(normalizeBlogSlug(post.slug))
}

export function getPublicBlogPosts(bundle: BlogPostsBundle): BlogPostItem[] {
  return bundle.posts.filter(isPublicBlogPost).sort((a, b) => a.order - b.order)
}

export function findBlogPostBySlug(bundle: BlogPostsBundle, slug: string, publicOnly = false): BlogPostItem | undefined {
  const normalized = normalizeBlogSlug(slug)
  return bundle.posts.find((post) => {
    if (publicOnly && !isPublicBlogPost(post)) return false
    return normalizeBlogSlug(post.slug) === normalized
  })
}

export function formatBlogDate(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function getBlogListCategories(bundle: BlogPostsBundle): string[] {
  const fromBundle = bundle.categories.filter((c) => c !== 'Tümü')
  const fromPosts = getPublicBlogPosts(bundle).map((p) => p.category)
  return ['Tümü', ...Array.from(new Set([...fromBundle, ...fromPosts].filter(Boolean)))]
}
