import { useState, useEffect } from 'react'
import { Edit, Save, RotateCcw } from 'lucide-react'
import type { PageData, PageSection } from '../../types/sections'
import { SectionEditorModal } from './SectionEditorModal'

interface PageSectionsProps {
  pageSlug: string
  defaultData: PageData
  storageKey: string
}

export function PageSections({ pageSlug, defaultData, storageKey }: PageSectionsProps) {
  const [pageData, setPageData] = useState<PageData>(defaultData)
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPageData(parsed)
      } catch (error) {
        console.error('Failed to parse saved data:', error)
        setPageData(defaultData)
      }
    } else {
      setPageData(defaultData)
    }
  }, [storageKey, pageSlug, defaultData])

  const handleSaveSection = (updatedSection: PageSection) => {
    const newSections = pageData.sections.map((section) =>
      section.id === updatedSection.id ? updatedSection : section
    )
    const newPageData = { ...pageData, sections: newSections }
    setPageData(newPageData)
    
    localStorage.setItem(storageKey, JSON.stringify(newPageData))
    
    setMessage({ type: 'success', text: 'Bölüm kaydedildi!' })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSaveAll = () => {
    localStorage.setItem(storageKey, JSON.stringify(pageData))
    setMessage({ type: 'success', text: 'Tüm değişiklikler kaydedildi!' })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleReset = () => {
    if (confirm('Tüm değişiklikler silinecek ve varsayılan içerik yüklenecek. Emin misiniz?')) {
      setPageData(defaultData)
      localStorage.setItem(storageKey, JSON.stringify(defaultData))
      setMessage({ type: 'success', text: 'Varsayılan içerik yüklendi!' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return '🚀'
      case 'services': return '⚙️'
      case 'brands': return '🏢'
      case 'why': return '💡'
      case 'process': return '📋'
      case 'cta': return '📢'
      case 'text-content': return '📝'
      case 'contact-info': return '📞'
      case 'contact-form': return '✉️'
      case 'service-features': return '⭐'
      case 'faq-list': return '❓'
      case 'blog-posts': return '📰'
      default: return '📄'
    }
  }

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'hero': return 'Hero Bölümü'
      case 'services': return 'Hizmetler'
      case 'brands': return 'Markalar'
      case 'why': return 'Neden Woontegra'
      case 'process': return 'Çalışma Süreci'
      case 'cta': return 'CTA (Call to Action)'
      case 'text-content': return 'Metin İçerik'
      case 'contact-info': return 'İletişim Bilgileri'
      case 'contact-form': return 'İletişim Formu'
      case 'service-features': return 'Hizmet Özellikleri'
      case 'faq-list': return 'SSS Listesi'
      case 'blog-posts': return 'Blog Yazıları'
      default: return 'Bölüm'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">{pageData.slug.toUpperCase()} Bölümleri</h2>
          <p className="text-xs text-slate-600 mt-1">Her bölümü ayrı ayrı düzenleyebilirsiniz</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="button-outline flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Sıfırla
          </button>
          <button onClick={handleSaveAll} className="button flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Tümünü Kaydet
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-3">
        {pageData.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSectionIcon(section.type)}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {getSectionTitle(section.type)}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {section.type === 'text-content' && `${(section.data as any).paragraphs?.length || 0} paragraf`}
                      {section.type === 'contact-info' && (section.data as any).email}
                      {section.type === 'contact-form' && (section.data as any).title}
                      {section.type === 'hero' && 'Ana başlık ve butonlar'}
                      {section.type === 'cta' && 'Harekete geçirici mesaj'}
                      {section.type === 'brands' && `${(section.data as any).items?.length || 0} marka`}
                      {section.type === 'service-features' && `${(section.data as any).features?.length || 0} özellik`}
                      {section.type === 'faq-list' && `${(section.data as any).items?.length || 0} soru`}
                      {section.type === 'blog-posts' && `${(section.data as any).posts?.length || 0} yazı`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingSection(section)}
                  className="button-secondary flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Düzenle
                </button>
              </div>
            </div>
          ))}
      </div>

      {editingSection && (
        <SectionEditorModal
          section={editingSection}
          onSave={handleSaveSection}
          onClose={() => setEditingSection(null)}
        />
      )}
    </div>
  )
}
