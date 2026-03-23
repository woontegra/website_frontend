import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPublicPage } from '../api/pages'
import { HtmlPageView } from '../components/page-renderer/HtmlPageView'
import { PageRenderer } from '../components/builder/PageRenderer'
import type { PageApiResponse } from '../types/page-api'

function PageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="py-24 animate-pulse bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-[1200px] text-center space-y-6">
          <div className="h-12 bg-slate-200 rounded-xl max-w-2xl mx-auto" />
          <div className="h-6 bg-slate-100 rounded-lg max-w-xl mx-auto" />
          <div className="flex justify-center gap-4 pt-4">
            <div className="h-12 w-32 bg-slate-200 rounded-xl" />
            <div className="h-12 w-32 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="py-20 border-t border-gray-100">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

function usePageSeo(page: PageApiResponse | null) {
  useEffect(() => {
    if (!page) return
    const site = 'Woontegra'
    const titleBase = page.title
    document.title = titleBase ? `${titleBase} | ${site}` : site
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', page.title || '')
  }, [page])
}

type State =
  | { kind: 'loading' }
  | { kind: 'ok'; data: PageApiResponse }
  | { kind: 'not_found' }
  | { kind: 'error'; message: string }

/** URL slug → API slug (tek segment) */
const SLUG_ALIASES: Record<string, string> = {
  'e-ticaret': 'eticaret',
}

export function DynamicPage({ slug }: { slug: string }) {
  const resolvedSlug = SLUG_ALIASES[slug] ?? slug
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    let ok = true
    setState({ kind: 'loading' })
    fetchPublicPage(resolvedSlug).then((r) => {
      if (!ok) return
      if (r.status === 'ok') setState({ kind: 'ok', data: r.data })
      else if (r.status === 'not_found') setState({ kind: 'not_found' })
      else setState({ kind: 'error', message: r.message })
    })
    return () => {
      ok = false
    }
  }, [resolvedSlug])

  const pageData = state.kind === 'ok' ? state.data : null
  usePageSeo(pageData)

  if (state.kind === 'loading') {
    return <PageSkeleton />
  }

  if (state.kind === 'not_found') {
    return (
      <div className="py-24 text-center px-4">
        <p className="text-slate-600">Sayfa bulunamadı veya yayında değil.</p>
        <p className="mt-2 text-sm text-slate-500 font-mono">Slug: {resolvedSlug}</p>
        <Link to="/" className="mt-6 inline-block text-accent-blue font-medium">
          Ana sayfaya dön
        </Link>
      </div>
    )
  }

  if (state.kind === 'error') {
    return (
      <div className="py-24 text-center px-4 max-w-lg mx-auto">
        <p className="text-slate-800 font-medium">Bir sorun oluştu</p>
        <p className="mt-2 text-sm text-slate-600">{state.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium"
        >
          Yeniden dene
        </button>
      </div>
    )
  }

  // Check if content is builder JSON
  const isBuilderContent = state.data.content?.trim().startsWith('{')
  
  if (isBuilderContent) {
    return <PageRenderer json={state.data.content} />
  }
  
  return <HtmlPageView page={state.data} />
}
