import type { ServiceFeaturesSectionData, ServiceFeature } from '../../../types/sections'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface ServiceFeaturesEditorProps {
  data: ServiceFeaturesSectionData
  onChange: (data: ServiceFeaturesSectionData) => void
}

export function ServiceFeaturesEditor({ data, onChange }: ServiceFeaturesEditorProps) {
  const handleChange = (field: keyof ServiceFeaturesSectionData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addFeature = () => {
    const newFeature: ServiceFeature = {
      title: 'Yeni Özellik',
      description: '',
      icon: 'Star',
    }
    handleChange('features', [...data.features, newFeature])
  }

  const updateFeature = (index: number, field: keyof ServiceFeature, value: string) => {
    const newFeatures = [...data.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    handleChange('features', newFeatures)
  }

  const removeFeature = (index: number) => {
    handleChange('features', data.features.filter((_, i) => i !== index))
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
        <label className="label">Alt Başlık</label>
        <input
          type="text"
          value={data.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          className="input w-full"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">Özellikler ({data.features.length})</label>
          <button
            onClick={addFeature}
            className="button flex items-center gap-1.5 h-8 px-3 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Ekle
          </button>
        </div>

        <div className="compact-space-y">
          {data.features.map((feature, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 text-slate-400 mt-2 cursor-move" />
                <div className="flex-1 compact-space-y">
                  <div>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      placeholder="Özellik başlığı"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      placeholder="Özellik açıklaması"
                      rows={2}
                      className="textarea w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                      placeholder="İkon adı (örn: Star, Zap)"
                      className="input w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeFeature(index)}
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
