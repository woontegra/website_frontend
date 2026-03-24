import type { CTASectionData } from '../../../types/sections'

interface CTAEditorProps {
  data: CTASectionData
  onChange: (data: CTASectionData) => void
}

export function CTAEditor({ data, onChange }: CTAEditorProps) {
  const handleChange = (field: keyof CTASectionData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="compact-space-y">
      <div>
        <label className="label">
          Ana Başlık
        </label>
        <textarea
          value={data.title}
          onChange={(e) => handleChange('title', e.target.value)}
          rows={2}
          className="textarea w-full"
        />
      </div>

      <div>
        <label className="label">
          Alt Başlık
        </label>
        <textarea
          value={data.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          rows={2}
          className="textarea w-full"
        />
      </div>

      <div>
        <label className="label">
          Buton Metni
        </label>
        <input
          type="text"
          value={data.buttonText}
          onChange={(e) => handleChange('buttonText', e.target.value)}
          className="input w-full"
        />
      </div>
    </div>
  )
}
