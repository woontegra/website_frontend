import { useCallback, useEffect, useState } from 'react'
import { Edit, Save, RotateCcw } from 'lucide-react'
import type { PageData, PageSection } from '../../types/sections'
import { defaultHomeData } from '../../data/defaultHomeData'
import {
  fetchPageSections,
  readLegacyPageSections,
  savePageSections,
} from '../../api/pageSections'
import { SectionEditorModal } from './SectionEditorModal'

const PAGE_KEY = 'home'
const STORAGE_KEY = 'woontegra_home_page'

export function HomeSections() {
  const [pageData, setPageData] = useState<PageData>(defaultHomeData)
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const persist = useCallback(async (data: PageData, successText: string) => {
    setSaving(true)
    setMessage(null)
    const result = await savePageSections(PAGE_KEY, data)
    setSaving(false)
    if (result.success) {
      setPageData(data)
      setMessage({ type: 'success', text: successText })
      setTimeout(() => setMessage(null), 3000)
      return true
    }
    setMessage({ type: 'error', text: result.message ?? 'Kayıt başarısız' })
    return false
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const fromApi = await fetchPageSections(PAGE_KEY)
      if (cancelled) return

      if (fromApi) {
        setPageData(fromApi)
        setLoading(false)
        return
      }

      const legacy = readLegacyPageSections(STORAGE_KEY)
      if (legacy) {
        setPageData(legacy)
        setMessage({
          type: 'success',
          text: 'Eski tarayıcı kaydı yüklendi. Kalıcı kayıt için "Tümünü Kaydet"e basın.',
        })
      }
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSaveSection = async (updatedSection: PageSection) => {
    const newSections = pageData.sections.map((section) =>
      section.id === updatedSection.id ? updatedSection : section,
    )
    const newPageData = { ...pageData, sections: newSections }
    const ok = await persist(newPageData, 'Bölüm sunucuya kaydedildi!')
    if (ok) setEditingSection(null)
  }

  const handleSaveAll = async () => {
    await persist(pageData, 'Tüm değişiklikler sunucuya kaydedildi!')
  }

  const handleReset = async () => {
    if (!confirm('Tüm değişiklikler silinecek ve varsayılan içerik yüklenecek. Emin misiniz?')) {
      return
    }
    await persist(defaultHomeData, 'Varsayılan içerik kaydedildi!')
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
      default:
        return 'Bölüm'
    }
  }

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-green-500" />
        <p className="text-sm text-slate-600">Ana sayfa bölümleri yükleniyor…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Ana Sayfa Bölümleri</h2>
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
                      {section.type === 'hero' && 'Ana başlık, alt başlık ve hero görseli'}
                      {section.type === 'services' &&
                        `${(section.data as { items?: unknown[] }).items?.length || 0} hizmet`}
                      {section.type === 'brands' &&
                        `${(section.data as { items?: unknown[] }).items?.length || 0} marka`}
                      {section.type === 'why' &&
                        `${(section.data as { items?: unknown[] }).items?.length || 0} özellik`}
                      {section.type === 'process' &&
                        `${(section.data as { steps?: unknown[] }).steps?.length || 0} adım`}
                      {section.type === 'cta' && 'Harekete geçirici mesaj'}
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
