import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { fetchPageContentBundle, savePageContentBundle } from '../../api/pageContentBundle'
import {
  defaultFooterGroupsBundle,
  FOOTER_GROUPS_KEY,
  mergeFooterGroups,
  type FooterGroupConfig,
  type FooterLinkConfig,
  type FooterGroupsBundle,
} from '../../data/footerGroupsContent'
import { AdminListEditorShell } from './AdminListEditorShell'

function newLink(): FooterLinkConfig {
  return { id: crypto.randomUUID(), label: 'Yeni link', href: '/', order: 0, enabled: true }
}

function newGroup(): FooterGroupConfig {
  return { id: crypto.randomUUID(), title: 'Yeni Grup', order: 0, enabled: true, links: [] }
}

export function AdminFooterEditor() {
  const [bundle, setBundle] = useState<FooterGroupsBundle>(defaultFooterGroupsBundle)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetchPageContentBundle(FOOTER_GROUPS_KEY, defaultFooterGroupsBundle, mergeFooterGroups).then((data) => {
      setBundle(data)
      setLoading(false)
    })
  }, [])

  const updateGroups = (groups: FooterGroupConfig[]) =>
    setBundle({ groups: groups.map((group, i) => ({ ...group, order: i })) })

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const payload = mergeFooterGroups(defaultFooterGroupsBundle, bundle)
    const result = await savePageContentBundle(FOOTER_GROUPS_KEY, payload)
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
      title="Footer Yönetimi"
      description="Footer link grupları: Hizmetler, Şirket, Yasal, İletişim. Çerez Tercihleri aksiyonu korunur."
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => void handleSave()}
      onAdd={() => updateGroups([...bundle.groups, newGroup()])}
      addLabel="+ Grup ekle"
    >
      {bundle.groups.map((group, gi) => (
        <div key={group.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col gap-1">
              <button type="button" disabled={gi === 0} onClick={() => {
                const groups = [...bundle.groups]
                ;[groups[gi - 1], groups[gi]] = [groups[gi], groups[gi - 1]]
                updateGroups(groups)
              }} className="text-slate-400 disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
              <button type="button" disabled={gi === bundle.groups.length - 1} onClick={() => {
                const groups = [...bundle.groups]
                ;[groups[gi], groups[gi + 1]] = [groups[gi + 1], groups[gi]]
                updateGroups(groups)
              }} className="text-slate-400 disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
            </div>
            <input className="input flex-1" value={group.title} onChange={(e) => {
              const groups = [...bundle.groups]
              groups[gi] = { ...group, title: e.target.value }
              updateGroups(groups)
            }} placeholder="Grup başlığı" />
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={group.enabled} onChange={(e) => {
              const groups = [...bundle.groups]
              groups[gi] = { ...group, enabled: e.target.checked }
              updateGroups(groups)
            }} />Aktif</label>
            <button type="button" onClick={() => updateGroups(bundle.groups.filter((_, i) => i !== gi))} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>

          <div className="space-y-2 pl-4 border-l-2 border-slate-200">
            {group.links.map((link, li) => (
              <div key={link.id} className="flex flex-wrap items-center gap-2">
                <input className="input flex-1" value={link.label} onChange={(e) => {
                  const groups = [...bundle.groups]
                  const links = [...group.links]
                  links[li] = { ...link, label: e.target.value }
                  groups[gi] = { ...group, links }
                  updateGroups(groups)
                }} />
                <select className="input w-36" value={link.action ?? 'link'} onChange={(e) => {
                  const groups = [...bundle.groups]
                  const links = [...group.links]
                  links[li] = e.target.value === 'cookie-preferences'
                    ? { ...link, action: 'cookie-preferences', href: undefined }
                    : { ...link, action: undefined, href: link.href || '/' }
                  groups[gi] = { ...group, links }
                  updateGroups(groups)
                }}>
                  <option value="link">Link</option>
                  <option value="cookie-preferences">Çerez Tercihleri</option>
                </select>
                {link.action !== 'cookie-preferences' && (
                  <input className="input flex-1 font-mono text-xs" value={link.href ?? ''} onChange={(e) => {
                    const groups = [...bundle.groups]
                    const links = [...group.links]
                    links[li] = { ...link, href: e.target.value }
                    groups[gi] = { ...group, links }
                    updateGroups(groups)
                  }} placeholder="/url veya https://..." />
                )}
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={link.enabled} onChange={(e) => {
                  const groups = [...bundle.groups]
                  const links = [...group.links]
                  links[li] = { ...link, enabled: e.target.checked }
                  groups[gi] = { ...group, links }
                  updateGroups(groups)
                }} />Aktif</label>
                <button type="button" onClick={() => {
                  const groups = [...bundle.groups]
                  groups[gi] = { ...group, links: group.links.filter((_, i) => i !== li) }
                  updateGroups(groups)
                }} className="text-xs text-red-600">Sil</button>
              </div>
            ))}
            <button type="button" onClick={() => {
              const groups = [...bundle.groups]
              groups[gi] = { ...group, links: [...group.links, newLink()] }
              updateGroups(groups)
            }} className="text-xs text-emerald-700 hover:underline">+ Link ekle</button>
          </div>
        </div>
      ))}
    </AdminListEditorShell>
  )
}
