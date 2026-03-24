import type { HeroSectionData } from '../../../types/sections'

interface HeroEditorProps {
  data: HeroSectionData
  onChange: (data: HeroSectionData) => void
}

export function HeroEditor({ data, onChange }: HeroEditorProps) {
  const handleChange = (field: keyof HeroSectionData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="compact-space-y">
      <div>
        <label className="label">
          Etiket
        </label>
        <input
          type="text"
          value={data.tag}
          onChange={(e) => handleChange('tag', e.target.value)}
          className="input w-full"
        />
      </div>

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

      <div className="grid grid-cols-2 compact-gap">
        <div>
          <label className="label">
            Buton 1 Metni
          </label>
          <input
            type="text"
            value={data.button1Text}
            onChange={(e) => handleChange('button1Text', e.target.value)}
            className="input w-full"
          />
        </div>

        <div>
          <label className="label">
            Buton 2 Metni
          </label>
          <input
            type="text"
            value={data.button2Text}
            onChange={(e) => handleChange('button2Text', e.target.value)}
            className="input w-full"
          />
        </div>
      </div>

      <div>
        <label className="label">
          Görsel URL (opsiyonel)
        </label>
        <input
          type="text"
          value={data.image || ''}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="/images/about-hero.jpg"
          className="input w-full"
        />
        <p className="text-xs text-slate-500 mt-1">
          Görseli /public/images/ klasörüne yükle ve yolunu buraya yaz
        </p>
      </div>
    </div>
  )
}
