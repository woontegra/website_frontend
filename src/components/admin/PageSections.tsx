import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Edit, Save, RotateCcw } from 'lucide-react'
import type { PageData, PageSection, SectionType } from '../../types/sections'
import {
  fetchPageSections,
  readLegacyPageSections,
  savePageSections,
} from '../../api/pageSections'
import { SectionEditorModal } from './SectionEditorModal'

interface PageSectionsProps {
  pageSlug: string
  defaultData: PageData
  storageKey: string
  excludeSectionTypes?: SectionType[]
  topNotice?: ReactNode
}

function withoutExcludedSections(data: PageData, excludeSectionTypes: SectionType[] = []): PageData {
  if (!excludeSectionTypes.length) return data
  const excluded = new Set(excludeSectionTypes)
  return {
    ...data,
    sections: data.sections.filter((section) => !excluded.has(section.type)),
  }
}

export function PageSections({
  pageSlug,
  defaultData,
  storageKey,
  excludeSectionTypes = [],
  topNotice,
}: PageSectionsProps) {
  const sanitizedDefault = withoutExcludedSections(defaultData, excludeSectionTypes)
  const [pageData, setPageData] = useState<PageData>(sanitizedDefault)
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const persist = useCallback(
    async (data: PageData, successText: string) => {
      setSaving(true)
      setMessage(null)
      const result = await savePageSections(pageSlug, data)
      setSaving(false)
      if (result.success) {
        setPageData(data)
        setMessage({ type: 'success', text: successText })
        setTimeout(() => setMessage(null), 3000)
        return true
      }
      setMessage({ type: 'error', text: result.message ?? 'Kayıt başarısız' })
      return false
    },
    [pageSlug],
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const fromApi = await fetchPageSections(pageSlug)
      if (cancelled) return

      if (fromApi) {
        setPageData(withoutExcludedSections(fromApi, excludeSectionTypes))
        setLoading(false)
        return
      }

      const legacy = readLegacyPageSections(storageKey)
      if (legacy) {
        setPageData(withoutExcludedSections(legacy, excludeSectionTypes))
        setMessage({
          type: 'success',
          text: 'Eski tarayıcı kaydı yüklendi. Kalıcı kayıt için "Tümünü Kaydet"e basın.',
        })
      } else {
        setPageData(sanitizedDefault)
      }
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [pageSlug, storageKey, sanitizedDefault, excludeSectionTypes])

  const handleSaveSection = async (updatedSection: PageSection) => {
    const newSections = pageData.sections.map((section) =>
      section.id === updatedSection.id ? updatedSection : section,
    )
    const newPageData = withoutExcludedSections({ ...pageData, sections: newSections }, excludeSectionTypes)
    const ok = await persist(newPageData, 'Bölüm sunucuya kaydedildi!')
    if (ok) setEditingSection(null)
  }

  const handleSaveAll = async () => {
    await persist(withoutExcludedSections(pageData, excludeSectionTypes), 'Tüm değişiklikler sunucuya kaydedildi!')
  }

  const handleReset = async () => {
    if (!confirm('Tüm değişiklikler silinecek ve varsayılan içerik yüklenecek. Emin misiniz?')) {
      return
    }
    await persist(sanitizedDefault, 'Varsayılan içerik kaydedildi!')
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero':
        return '🚀'
      case 'services':
        return '⚙️'
      case 'brands':
        return '🏢'
      case 'why':
        return '💡'
      case 'process':
        return '📋'
      case 'cta':
        return '📢'
      case 'text-content':
        return '📝'
      case 'contact-info':
        return '📞'
      case 'contact-form':
        return '✉️'
      case 'service-features':
        return '⭐'
      case 'faq-list':
        return '❓'
      case 'blog-posts':
        return '📰'
      default:
        return '📄'
    }
  }

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'hero':
        return 'Hero Bölümü'
      case 'services':
        return 'Hizmetler'
      case 'brands':
        return 'Markalar'
      case 'why':
        return 'Neden Woontegra'
      case 'process':
        return 'Çalışma Süreci'
      case 'cta':
        return 'CTA (Call to Action)'
      case 'text-content':
        return 'Metin İçerik'
      case 'contact-info':
        return 'İletişim Bilgileri'
      case 'contact-form':
        return 'İletişim Formu'
      case 'service-features':
        return 'Hizmet Özellikleri'
      case 'faq-list':
        return 'SSS Listesi'
      case 'blog-posts':
        return 'Blog Yazıları'
      default:
        return 'Bölüm'
    }
  }

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-green-500" />
        <p className="text-sm text-slate-600">Sayfa bölümleri yükleniyor…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">{pageData.slug.toUpperCase()} Bölümleri</h2>
          <p className="mt-1 text-xs text-slate-600">
            Görseller public/images listesinden seçilir; değişiklikler veritabanına kaydedilir.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="button-outline flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Sıfırla
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="button flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Kaydediliyor…' : 'Tümünü Kaydet'}
          </button>
        </div>
      </div>

      {message ? (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === 'success'
              ? 'border border-green-200 bg-green-50 text-green-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      {topNotice}

      <div className="grid gap-3">
        {pageData.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} className="card transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSectionIcon(section.type)}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {getSectionTitle(section.type)}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {section.type === 'text-content' &&
                        `${(section.data as { paragraphs?: unknown[] }).paragraphs?.length || 0} paragraf`}
                      {section.type === 'contact-info' &&
                        (section.data as { email?: string }).email}
                      {section.type === 'contact-form' &&
                        (section.data as { title?: string }).title}
                      {section.type === 'hero' && 'Başlık, butonlar ve hero görseli'}
                      {section.type === 'cta' && 'Harekete geçirici mesaj'}
                      {section.type === 'brands' &&
                        `${(section.data as { items?: unknown[] }).items?.length || 0} marka`}
                      {section.type === 'service-features' &&
                        `${(section.data as { features?: unknown[] }).features?.length || 0} özellik`}
                      {section.type === 'faq-list' &&
                        `${(section.data as { items?: unknown[] }).items?.length || 0} soru`}
                      {section.type === 'blog-posts' &&
                        `${(section.data as { posts?: unknown[] }).posts?.length || 0} yazı`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingSection(section)}
                  className="button-secondary flex items-center gap-1.5"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Düzenle
                </button>
              </div>
            </div>
          ))}
      </div>

      {editingSection ? (
        <SectionEditorModal
          section={editingSection}
          onSave={handleSaveSection}
          onClose={() => setEditingSection(null)}
        />
      ) : null}
    </div>
  )
}
