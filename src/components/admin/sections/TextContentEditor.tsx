import type { TextContentSectionData } from '../../../types/sections'
import { Plus, Trash2 } from 'lucide-react'

interface TextContentEditorProps {
  data: TextContentSectionData
  onChange: (data: TextContentSectionData) => void
}

export function TextContentEditor({ data, onChange }: TextContentEditorProps) {
  const handleChange = (field: keyof TextContentSectionData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addParagraph = () => {
    handleChange('paragraphs', [...data.paragraphs, ''])
  }

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...data.paragraphs]
    newParagraphs[index] = value
    handleChange('paragraphs', newParagraphs)
  }

  const removeParagraph = (index: number) => {
    handleChange('paragraphs', data.paragraphs.filter((_, i) => i !== index))
  }

  return (
    <div className="compact-space-y">
      <div>
        <label className="label">Başlık</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="input w-full"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">Paragraflar ({data.paragraphs.length})</label>
          <button
            onClick={addParagraph}
            className="button flex items-center gap-1.5 h-8 px-3 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Ekle
          </button>
        </div>

        <div className="compact-space-y">
          {data.paragraphs.map((paragraph, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
                rows={3}
                placeholder={`Paragraf ${index + 1}`}
                className="textarea flex-1"
              />
              <button
                onClick={() => removeParagraph(index)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors h-fit"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Vurgulu Metin (Opsiyonel)</label>
        <input
          type="text"
          value={data.highlight || ''}
          onChange={(e) => handleChange('highlight', e.target.value)}
          placeholder="Öne çıkarmak istediğiniz cümle"
          className="input w-full"
        />
      </div>
    </div>
  )
}
