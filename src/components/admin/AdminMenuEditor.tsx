import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { fetchPageContentBundle, savePageContentBundle } from '../../api/pageContentBundle'
import {
  defaultMenuItemsBundle,
  MENU_ITEMS_KEY,
  mergeMenuItems,
  type MenuItemConfig,
  type MenuItemsBundle,
} from '../../data/menuItemsContent'
import { AdminListEditorShell } from './AdminListEditorShell'

function newItem(label = 'Yeni öğe'): MenuItemConfig {
  return {
    id: crypto.randomUUID(),
    label,
    href: '/',
    order: 0,
    enabled: true,
    openInNewTab: false,
    isButton: false,
  }
}

function moveMenuItems(list: MenuItemConfig[], index: number, direction: -1 | 1): MenuItemConfig[] {
  const next = [...list]
  const target = index + direction
  if (target < 0 || target >= next.length) return list
  ;[next[index], next[target]] = [next[target], next[index]]
  return next.map((item, i) => ({ ...item, order: i }))
}

function ItemRow({
  item,
  index,
  total,
  onChange,
  onRemove,
  onMove,
  showChildren,
}: {
  item: MenuItemConfig
  index: number
  total: number
  onChange: (patch: Partial<MenuItemConfig>) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
  showChildren?: boolean
}) {
  const [childrenOpen, setChildrenOpen] = useState(false)

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-col gap-1">
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(1)} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <input className="input min-w-[140px] flex-1" value={item.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Başlık" />
        <input className="input min-w-[180px] flex-1 font-mono text-xs" value={item.href} onChange={(e) => onChange({ href: e.target.value })} placeholder="/url" />
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <input type="checkbox" checked={item.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} />
          Aktif
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <input type="checkbox" checked={item.openInNewTab} onChange={(e) => onChange({ openInNewTab: e.target.checked })} />
          Yeni sekme
        </label>
        {showChildren && (
          <button type="button" onClick={() => setChildrenOpen((o) => !o)} className="text-xs font-medium text-slate-600 hover:text-slate-900">
            Alt menü ({item.children?.length ?? 0})
          </button>
        )}
        <button type="button" onClick={onRemove} className="ml-auto text-red-600 hover:text-red-800">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {showChildren && childrenOpen && (
        <div className="space-y-2 border-t border-slate-200 pt-3 pl-6">
          {(item.children ?? []).map((child, ci) => (
            <div key={child.id} className="flex flex-wrap items-center gap-2">
              <input className="input flex-1" value={child.label} onChange={(e) => {
                const children = [...(item.children ?? [])]
                children[ci] = { ...child, label: e.target.value }
                onChange({ children })
              }} placeholder="Alt başlık" />
              <input className="input flex-1 font-mono text-xs" value={child.href} onChange={(e) => {
                const children = [...(item.children ?? [])]
                children[ci] = { ...child, href: e.target.value }
                onChange({ children })
              }} placeholder="/alt-url" />
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={child.enabled} onChange={(e) => {
                  const children = [...(item.children ?? [])]
                  children[ci] = { ...child, enabled: e.target.checked }
                  onChange({ children })
                }} />
                Aktif
              </label>
              <button type="button" onClick={() => onChange({ children: item.children?.filter((c) => c.id !== child.id) })} className="text-red-600 text-xs">Sil</button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs text-emerald-700 hover:underline"
            onClick={() => onChange({ children: [...(item.children ?? []), newItem('Alt öğe')] })}
          >
            + Alt öğe ekle
          </button>
        </div>
      )}
    </div>
  )
}

export function AdminMenuEditor() {
  const [bundle, setBundle] = useState<MenuItemsBundle>(defaultMenuItemsBundle)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetchPageContentBundle(MENU_ITEMS_KEY, defaultMenuItemsBundle, mergeMenuItems).then((data) => {
      setBundle(data)
      setLoading(false)
    })
  }, [])

  const updateItems = (items: MenuItemConfig[]) => setBundle((prev) => ({ ...prev, items: items.map((item, i) => ({ ...item, order: i })) }))
  const updateButtons = (headerButtons: MenuItemConfig[]) =>
    setBundle((prev) => ({ ...prev, headerButtons: headerButtons.map((item, i) => ({ ...item, order: i, isButton: true })) }))

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const payload = mergeMenuItems(defaultMenuItemsBundle, bundle)
    const result = await savePageContentBundle(MENU_ITEMS_KEY, payload)
    setSaving(false)
    if (result.success) {
      setBundle(payload)
      setMessage('✓ Kaydedildi')
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage(`Hata: ${result.message ?? 'Kayıt başarısız'}`)
    }
  }

  return (
    <AdminListEditorShell
      title="Menü Yönetimi"
      description="Header menü öğeleri ve üst butonlar. Boş bırakılırsa varsayılan menü kullanılır."
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => void handleSave()}
      onAdd={() => updateItems([...bundle.items, newItem()])}
      addLabel="+ Menü öğesi ekle"
    >
      {bundle.items.map((item, index) => (
        <ItemRow
          key={item.id}
          item={item}
          index={index}
          total={bundle.items.length}
          showChildren
          onChange={(patch) => {
            const items = [...bundle.items]
            items[index] = { ...items[index], ...patch }
            updateItems(items)
          }}
          onRemove={() => updateItems(bundle.items.filter((_, i) => i !== index))}
          onMove={(dir) => updateItems(moveMenuItems(bundle.items, index, dir))}
        />
      ))}

      <div className="border-t border-slate-200 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Header Butonları</h3>
        {bundle.headerButtons.map((btn, index) => (
          <ItemRow
            key={btn.id}
            item={btn}
            index={index}
            total={bundle.headerButtons.length}
            onChange={(patch) => {
              const headerButtons = [...bundle.headerButtons]
              headerButtons[index] = { ...headerButtons[index], ...patch, isButton: true }
              updateButtons(headerButtons)
            }}
            onRemove={() => updateButtons(bundle.headerButtons.filter((_, i) => i !== index))}
            onMove={(dir) => updateButtons(moveMenuItems(bundle.headerButtons, index, dir))}
          />
        ))}
        <button type="button" onClick={() => updateButtons([...bundle.headerButtons, { ...newItem('Buton'), isButton: true }])} className="mt-2 text-xs text-emerald-700 hover:underline">
          + Buton ekle
        </button>
      </div>
    </AdminListEditorShell>
  )
}
