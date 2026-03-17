import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPageBySlug } from '../api/cms'
import type { CmsPage } from '../types/cms'
import { CmsSectionView } from '../components/cms/CmsSections'

export function DynamicPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<CmsPage | null | undefined>(undefined)

  useEffect(() => {
    let ok = true
    fetchPageBySlug(slug).then((p) => {
      if (ok) setPage(p)
    })
    return () => {
      ok = false
    }
  }, [slug])

  if (page === undefined) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Yükleniyor…</div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="py-24 text-center px-4">
        <p className="text-slate-600">Sayfa bulunamadı veya yayında değil.</p>
        <p className="mt-2 text-sm text-slate-500">Slug: {slug}</p>
        <Link to="/" className="mt-6 inline-block text-accent-blue font-medium">Ana sayfaya dön</Link>
      </div>
    )
  }

  const sections = [...page.sections].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen">
      {sections.map((section) => (
        <CmsSectionView key={section.id} section={section} pageFaqs={page.faqs} />
      ))}
    </div>
  )
}
