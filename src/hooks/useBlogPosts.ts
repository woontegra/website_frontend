import { useEffect, useState } from 'react'
import { fetchPageContentBundle } from '../api/pageContentBundle'
import {
  BLOG_POSTS_KEY,
  defaultBlogPostsBundle,
  mergeBlogPostsBundle,
  type BlogPostsBundle,
} from '../data/blogPostsContent'

export function useBlogPosts(): { bundle: BlogPostsBundle; loaded: boolean } {
  const [bundle, setBundle] = useState<BlogPostsBundle>(() => mergeBlogPostsBundle(defaultBlogPostsBundle))
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    void fetchPageContentBundle(BLOG_POSTS_KEY, defaultBlogPostsBundle, mergeBlogPostsBundle).then((data) => {
      setBundle(data)
      setLoaded(true)
    })
  }, [])

  return { bundle, loaded }
}
