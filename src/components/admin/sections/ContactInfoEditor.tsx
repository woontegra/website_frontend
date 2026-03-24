import type { ContactInfoSectionData } from '../../../types/sections'

interface ContactInfoEditorProps {
  data: ContactInfoSectionData
  onChange: (data: ContactInfoSectionData) => void
}

export function ContactInfoEditor({ data, onChange }: ContactInfoEditorProps) {
  const handleChange = (field: keyof ContactInfoSectionData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="compact-space-y">
      <div>
        <label className="label">E-posta</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="input w-full"
        />
      </div>

      <div className="grid grid-cols-2 compact-gap">
        <div>
          <label className="label">Telefon</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="input w-full"
          />
        </div>

        <div>
          <label className="label">WhatsApp (Opsiyonel)</label>
          <input
            type="tel"
            value={data.whatsapp || ''}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            placeholder="905321234567"
            className="input w-full"
          />
        </div>
      </div>

      <div>
        <label className="label">Adres</label>
        <textarea
          value={data.address}
          onChange={(e) => handleChange('address', e.target.value)}
          rows={2}
          className="textarea w-full"
        />
      </div>

      <div>
        <label className="label">Google Maps Embed (Opsiyonel)</label>
        <input
          type="url"
          value={data.mapEmbed || ''}
          onChange={(e) => handleChange('mapEmbed', e.target.value)}
          placeholder="https://www.google.com/maps/embed?pb=..."
          className="input w-full"
        />
      </div>
    </div>
  )
}
