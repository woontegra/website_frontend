import type { BrandsSectionData, BrandItem } from '../../../types/sections'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface BrandsEditorProps {
  data: BrandsSectionData
  onChange: (data: BrandsSectionData) => void
}

export function BrandsEditor({ data, onChange }: BrandsEditorProps) {
  const handleChange = (field: keyof BrandsSectionData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addItem = () => {
    const newItem: BrandItem = {
      name: 'Yeni Marka',
      description: '',
      image: '',
    }
    handleChange('items', [...data.items, newItem])
  }

  const updateItem = (index: number, field: keyof BrandItem, value: string) => {
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
        <label className="label">
          Bölüm Başlığı
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="input w-full"
        />
      </div>

      <div>
        <label className="label">
          Alt Başlık
        </label>
        <input
          type="text"
          value={data.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          className="input w-full"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">
            Markalar ({data.items.length})
          </label>
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
              <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 text-slate-400 mt-2 cursor-move" />
                <div className="flex-1 compact-space-y">
                  <div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Marka adı"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Marka açıklaması"
                      rows={2}
                      className="textarea w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => updateItem(index, 'image', e.target.value)}
                      placeholder="Görsel URL"
                      className="input w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
