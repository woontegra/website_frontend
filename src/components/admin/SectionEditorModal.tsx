import { useState } from 'react'
import { X, Save } from 'lucide-react'
import type { PageSection, SectionData } from '../../types/sections'
import { HeroEditor } from './sections/HeroEditor'
import { ServicesEditor } from './sections/ServicesEditor'
import { BrandsEditor } from './sections/BrandsEditor'
import { CTAEditor } from './sections/CTAEditor'
import { TextContentEditor } from './sections/TextContentEditor'
import { ContactInfoEditor } from './sections/ContactInfoEditor'
import { ServiceFeaturesEditor } from './sections/ServiceFeaturesEditor'
import { FAQEditor } from './sections/FAQEditor'
import { BlogPostsEditor } from './sections/BlogPostsEditor'

interface SectionEditorModalProps {
  section: PageSection
  onSave: (updatedSection: PageSection) => void
  onClose: () => void
}

export function SectionEditorModal({ section, onSave, onClose }: SectionEditorModalProps) {
  const [editedData, setEditedData] = useState<SectionData>(section.data)

  const handleSave = () => {
    onSave({ ...section, data: editedData })
    onClose()
  }

  const getSectionTitle = () => {
    switch (section.type) {
      case 'hero':
        return 'Hero Bölümü'
      case 'services':
        return 'Hizmetler Bölümü'
      case 'brands':
        return 'Markalar Bölümü'
      case 'why':
        return 'Neden Woontegra Bölümü'
      case 'process':
        return 'Süreç Bölümü'
      case 'cta':
        return 'CTA Bölümü'
      case 'text-content':
        return 'Metin İçerik Bölümü'
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
        return 'Bölüm Düzenle'
    }
  }

  const renderEditor = () => {
    switch (section.type) {
      case 'hero':
        return <HeroEditor data={editedData as any} onChange={setEditedData} />
      case 'services':
        return <ServicesEditor data={editedData as any} onChange={setEditedData} />
      case 'brands':
        return <BrandsEditor data={editedData as any} onChange={setEditedData} />
      case 'cta':
        return <CTAEditor data={editedData as any} onChange={setEditedData} />
      case 'text-content':
        return <TextContentEditor data={editedData as any} onChange={setEditedData} />
      case 'contact-info':
        return <ContactInfoEditor data={editedData as any} onChange={setEditedData} />
      case 'service-features':
        return <ServiceFeaturesEditor data={editedData as any} onChange={setEditedData} />
      case 'faq-list':
        return <FAQEditor data={editedData as any} onChange={setEditedData} />
      case 'blog-posts':
        return <BlogPostsEditor data={editedData as any} onChange={setEditedData} />
      default:
        return <div className="text-sm text-slate-600">Bu bölüm için editor henüz hazır değil.</div>
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-slate-900">{getSectionTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderEditor()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="button-outline"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="button flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
