import type { FAQSectionData, FAQItem } from '../../../types/sections'
import { Plus, Trash2 } from 'lucide-react'

interface FAQEditorProps {
  data: FAQSectionData
  onChange: (data: FAQSectionData) => void
}

export function FAQEditor({ data, onChange }: FAQEditorProps) {
  const handleChange = (field: keyof FAQSectionData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addItem = () => {
    const newItem: FAQItem = {
      question: '',
      answer: '',
    }
    handleChange('items', [...data.items, newItem])
  }

  const updateItem = (index: number, field: keyof FAQItem, value: string) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }
    handleChange('items', newItems)
  }

  const removeItem = (index: number) => {
    handleChange('items', data.items.filter((_, i) => i !== index))
  }

  return (
    <div className="compact-space-y">
      <div>
        <label className="label">Bölüm Başlığı</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="input w-full"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">Sorular ({data.items.length})</label>
          <button
            onClick={addItem}
            className="button flex items-center gap-1.5 h-8 px-3 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Ekle
          </button>
        </div>

        <div className="compact-space-y">
          {data.items.map((item, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex gap-2">
                <div className="flex-1 compact-space-y">
                  <div>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => updateItem(index, 'question', e.target.value)}
                      placeholder="Soru"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateItem(index, 'answer', e.target.value)}
                      placeholder="Cevap"
                      rows={3}
                      className="textarea w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors h-fit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
