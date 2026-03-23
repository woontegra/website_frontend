import { useEditor } from '@craftjs/core'
import { Save, Eye, Undo, Redo } from 'lucide-react'

interface TopbarProps {
  onSave: () => void
  onPreview: () => void
}

export const Topbar = ({ onSave, onPreview }: TopbarProps) => {
  const { actions, canUndo, canRedo } = useEditor((_state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }))

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => actions.history.undo()}
          disabled={!canUndo}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Geri Al"
        >
          <Undo className="w-5 h-5" />
        </button>
        <button
          onClick={() => actions.history.redo()}
          disabled={!canRedo}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="İleri Al"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium"
        >
          <Eye className="w-5 h-5" />
          Önizle
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold shadow-lg shadow-green-500/20"
        >
          <Save className="w-5 h-5" />
          Kaydet
        </button>
      </div>
    </div>
  )
}
