import type { ServicesSectionData, ServiceItem } from '../../../types/sections'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface ServicesEditorProps {
  data: ServicesSectionData
  onChange: (data: ServicesSectionData) => void
}

export function ServicesEditor({ data, onChange }: ServicesEditorProps) {
  const handleChange = (field: keyof ServicesSectionData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addItem = () => {
    const newItem: ServiceItem = {
      title: 'Yeni Hizmet',
      description: '',
      icon: 'Star',
    }
    handleChange('items', [...data.items, newItem])
  }

  const updateItem = (index: number, field: keyof ServiceItem, value: string) => {
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
            Hizmetler ({data.items.length})
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
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      placeholder="Hizmet başlığı"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Hizmet açıklaması"
                      rows={2}
                      className="textarea w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => updateItem(index, 'icon', e.target.value)}
                      placeholder="İkon adı (örn: Code, Palette)"
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
