import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Save } from 'lucide-react'
import {
  AdminLegalPageEditor,
  type AdminLegalPageEditorHandle,
} from './AdminLegalPageEditor'
import { LEGAL_PAGE_DEFINITIONS } from '../../data/legalPageContent'

export function AdminLegalPagesEditor() {
  const [activeKey, setActiveKey] = useState(LEGAL_PAGE_DEFINITIONS[0].key)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const editorRef = useRef<AdminLegalPageEditorHandle>(null)

  const activeDefinition =
    LEGAL_PAGE_DEFINITIONS.find((item) => item.key === activeKey) ?? LEGAL_PAGE_DEFINITIONS[0]

  const handleSave = async () => {
    setSaving(true)
    const ok = await editorRef.current?.save()
    setSaving(false)
    if (ok) {
      setTimeout(() => setMessage(null), 4000)
    }
  }

  const previewPath = activeDefinition.livePath

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 -mx-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:-mx-0 sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {LEGAL_PAGE_DEFINITIONS.map((definition) => (
              <button
                key={definition.key}
                type="button"
                onClick={() => {
                  setActiveKey(definition.key)
                  setMessage(null)
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                  activeKey === definition.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {definition.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 self-end lg:self-auto">
            <a
              href={previewPath}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary inline-flex items-center gap-1.5 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Önizle
            </a>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="button inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Firma bilgileri{' '}
          <Link to="/admin/firma-bilgileri" className="font-medium text-emerald-700 hover:underline">
            Firma Bilgileri
          </Link>{' '}
          sayfasından yönetilir.
        </p>

        {message ? (
          <div
            className={`mt-2 rounded-lg px-3 py-2 text-sm ${
              message.type === 'success'
                ? 'border border-green-200 bg-green-50 text-green-800'
                : 'border border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        ) : null}
      </div>

      <AdminLegalPageEditor
        key={activeKey}
        ref={editorRef}
        definition={activeDefinition}
        onMessage={setMessage}
      />
    </div>
  )
}
