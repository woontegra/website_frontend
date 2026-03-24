import { useState, useEffect } from 'react'
import { Edit, Save, RotateCcw } from 'lucide-react'
import type { PageData, PageSection } from '../../types/sections'
import { defaultHomeData } from '../../data/defaultHomeData'
import { SectionEditorModal } from './SectionEditorModal'

const STORAGE_KEY = 'woontegra_home_page'

export function HomeSections() {
  const [pageData, setPageData] = useState<PageData>(defaultHomeData)
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPageData(parsed)
      } catch (error) {
        console.error('Failed to parse saved data:', error)
      }
    }
  }, [])

  const handleSaveSection = (updatedSection: PageSection) => {
    const newSections = pageData.sections.map((section) =>
      section.id === updatedSection.id ? updatedSection : section
    )
    const newPageData = { ...pageData, sections: newSections }
    setPageData(newPageData)
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPageData))
    
    setMessage({ type: 'success', text: 'Bölüm kaydedildi!' })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSaveAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData))
    setMessage({ type: 'success', text: 'Tüm değişiklikler kaydedildi!' })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleReset = () => {
    if (confirm('Tüm değişiklikler silinecek ve varsayılan içerik yüklenecek. Emin misiniz?')) {
      setPageData(defaultHomeData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultHomeData))
      setMessage({ type: 'success', text: 'Varsayılan içerik yüklendi!' })
      setTimeout(() => setMessage(null), 3000)
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Ana Sayfa Bölümleri</h2>
          <p className="text-xs text-slate-600 mt-1">Her bölümü ayrı ayrı düzenleyebilirsiniz</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="button-outline flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sıfırla
          </button>
          <button
            onClick={handleSaveAll}
            className="button flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Tümünü Kaydet
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Sections Grid */}
      <div className="grid gap-3">
        {pageData.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div
              key={section.id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSectionIcon(section.type)}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {getSectionTitle(section.type)}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {section.type === 'hero' && 'Ana başlık, alt başlık ve butonlar'}
                      {section.type === 'services' && `${(section.data as any).items?.length || 0} hizmet`}
                      {section.type === 'brands' && `${(section.data as any).items?.length || 0} marka`}
                      {section.type === 'why' && `${(section.data as any).items?.length || 0} özellik`}
                      {section.type === 'process' && `${(section.data as any).steps?.length || 0} adım`}
                      {section.type === 'cta' && 'Harekete geçirici mesaj'}
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

      {/* Editor Modal */}
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
