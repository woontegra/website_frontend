import { useEditor } from '@craftjs/core'
import { Trash2 } from 'lucide-react'

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const currentNodeId = state.events.selected.values().next().value
    let selected

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related?.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      }
    }

    return { selected }
  })

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      {selected ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
            {selected.isDeletable && (
              <button
                onClick={() => actions.delete(selected.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          {selected.settings && <selected.settings />}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👆</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Düzenlemek için bir component seçin
          </p>
        </div>
      )}
    </div>
  )
}
