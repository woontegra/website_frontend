import { Save } from 'lucide-react'
import type { ReactNode } from 'react'

type AdminListEditorShellProps = {
  title: string
  description: string
  loading: boolean
  saving: boolean
  message: string
  onSave: () => void
  onAdd: () => void
  addLabel?: string
  children: ReactNode
}

export function AdminListEditorShell({
  title,
  description,
  loading,
  saving,
  message,
  onSave,
  onAdd,
  addLabel = '+ Ekle',
  children,
}: AdminListEditorShellProps) {
  if (loading) {
    return <p className="text-sm text-slate-600">Yükleniyor…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={saving}
          className="button flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>

      {message && (
        <p
          className={`text-sm ${message.startsWith('Hata') || message.startsWith('✗') ? 'text-red-600' : 'text-emerald-700'}`}
        >
          {message}
        </p>
      )}

      <div className="card space-y-3">{children}</div>

      <button type="button" onClick={onAdd} className="text-sm font-medium text-emerald-700 hover:underline">
        {addLabel}
      </button>
    </div>
  )
}
