import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../api/cms'
import type { CmsPage, CmsSection, CmsFaq } from '../../types/cms'

const SECTION_TYPES = [
  'hero',
  'page_hero',
  'service_hero',
  'trust_grid',
  'card_grid',
  'sub_brands',
  'why_grid',
  'process_steps',
  'stats_row',
  'cta',
  'overview',
  'target_audience',
  'features_list',
  'process_timeline',
  'faq_block',
  'rich_text',
  'service_cards',
  'blog_api',
  'contact_form',
  'quote_form',
]

export function AdminCmsPageEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'yeni'

  const [page, setPage] = useState<CmsPage | null>(null)
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(!isNew)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (isNew) {
      setLoading(false)
      return
    }
    adminApi<CmsPage>(`/pages/${id}`).then((r) => {
      if (r.success && r.data) {
        const p = r.data as unknown as CmsPage
        setPage(p)
        setSlug(p.slug)
        setTitle(p.title)
        setIsActive(true)
      } else setMsg(r.message ?? 'Sayfa yüklenemedi')
      setLoading(false)
    })
  }, [id, isNew])

  const saveMeta = async () => {
    if (isNew) {
      const r = await adminApi<{ id: string }>('/pages', {
        method: 'POST',
        body: JSON.stringify({ slug, title, isActive }),
      })
      if (r.success && r.data) navigate(`/admin/cms/${(r.data as { id: string }).id}`, { replace: true })
      else setMsg(r.message ?? 'Hata')
      return
    }
    await adminApi(`/pages/${id}`, { method: 'PUT', body: JSON.stringify({ slug, title, isActive }) })
    setMsg('Kaydedildi')
  }

  const addSection = async () => {
    if (!id || isNew) return
    const type = window.prompt('Section tipi', 'rich_text') ?? 'rich_text'
    await adminApi('/sections', {
      method: 'POST',
      body: JSON.stringify({ pageId: id, type, title: '', content: {} }),
    })
    window.location.reload()
  }

  const moveSection = async (sections: CmsSection[], index: number, dir: -1 | 1) => {
    const j = index + dir
    if (j < 0 || j >= sections.length) return
    const sorted = [...sections].sort((a, b) => a.order - b.order)
    const ids = sorted.map((s) => s.id)
    ;[ids[index], ids[j]] = [ids[j], ids[index]]
    await adminApi('/sections/reorder', { method: 'PATCH', body: JSON.stringify({ pageId: id, orderedIds: ids }) })
    window.location.reload()
  }

  const deleteSection = async (sid: string) => {
    if (!confirm('Section silinsin mi?')) return
    await adminApi(`/sections/${sid}`, { method: 'DELETE' })
    window.location.reload()
  }

  if (loading) return <p className="text-slate-500">Yükleniyor…</p>

  const sections = page ? [...page.sections].sort((a, b) => a.order - b.order) : []
  const faqs = page?.faqs ?? []

  return (
    <div className="max-w-4xl">
      <Link to="/admin/cms" className="text-sm text-accent-blue mb-6 inline-block">
        ← Sayfalar
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{isNew ? 'Yeni sayfa' : title}</h1>
      {msg && <p className="mb-4 text-sm text-slate-600">{msg}</p>}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2 font-mono text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ornek-sayfa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <span className="text-sm">Aktif</span>
        </label>
        <button type="button" onClick={saveMeta} className="px-6 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm">
          Kaydet
        </button>
      </div>

      {!isNew && page && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Bölümler (sections)</h2>
            <button type="button" onClick={addSection} className="text-sm font-semibold text-accent-blue">
              + Section ekle
            </button>
          </div>
          <div className="space-y-4 mb-12">
            {sections.map((s, i) => (
              <SectionEditorCard
                key={s.id}
                section={s}
                pageId={page.id}
                index={i}
                total={sections.length}
                onMove={moveSection}
                onDelete={() => deleteSection(s.id)}
                allSections={sections}
              />
            ))}
          </div>

          <h2 className="text-lg font-bold text-slate-900 mb-4">SSS (sayfa bazlı)</h2>
          <FaqEditor pageId={page.id} faqs={faqs} onReload={() => window.location.reload()} />
        </>
      )}
    </div>
  )
}

function SectionEditorCard({
  section,
  pageId,
  index,
  total,
  onMove,
  onDelete,
  allSections,
}: {
  section: CmsSection
  pageId: string
  index: number
  total: number
  onMove: (s: CmsSection[], i: number, d: -1 | 1) => void
  onDelete: () => void
  allSections: CmsSection[]
}) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(section.type)
  const [secTitle, setSecTitle] = useState(section.title ?? '')
  const [contentJson, setContentJson] = useState(JSON.stringify(section.content ?? {}, null, 2))
  const [itemForms, setItemForms] = useState(false)

  const saveSection = async () => {
    let content: object = {}
    try {
      content = JSON.parse(contentJson)
    } catch {
      alert('Content geçerli JSON olmalı')
      return
    }
    await adminApi(`/sections/${section.id}`, {
      method: 'PUT',
      body: JSON.stringify({ type, title: secTitle || null, content }),
    })
    window.location.reload()
  }

  const addItem = async () => {
    const t = window.prompt('Öğe başlığı') ?? 'Yeni öğe'
    await adminApi('/items', {
      method: 'POST',
      body: JSON.stringify({ sectionId: section.id, title: t, description: '', order: section.items.length }),
    })
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-gray-200">
        <button type="button" className="font-semibold text-slate-900 text-left" onClick={() => setOpen(!open)}>
          {open ? '▼' : '▶'} {section.type} {section.title && `— ${section.title}`}
        </button>
        <div className="flex gap-2">
          <button type="button" className="text-xs px-2 py-1 border rounded" disabled={index === 0} onClick={() => onMove(allSections, index, -1)}>
            ↑
          </button>
          <button
            type="button"
            className="text-xs px-2 py-1 border rounded"
            disabled={index >= total - 1}
            onClick={() => onMove(allSections, index, 1)}
          >
            ↓
          </button>
          <button type="button" className="text-xs text-red-600" onClick={onDelete}>
            Sil
          </button>
        </div>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-slate-500">Tip</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
              {SECTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">Section başlığı</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={secTitle} onChange={(e) => setSecTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-500">Content (JSON)</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-xs font-mono h-40" value={contentJson} onChange={(e) => setContentJson(e.target.value)} />
          </div>
          <button type="button" onClick={saveSection} className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-semibold">
            Section kaydet
          </button>
          <hr className="my-4" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Öğeler ({section.items.length})</span>
            <button type="button" className="text-sm text-accent-blue" onClick={() => setItemForms(!itemForms)}>
              {itemForms ? 'Kapat' : 'Düzenle'}
            </button>
            <button type="button" className="text-sm text-accent-blue" onClick={addItem}>
              + Öğe
            </button>
          </div>
          {itemForms &&
            section.items.map((it) => (
              <ItemRow key={it.id} item={it} />
            ))}
        </div>
      )}
    </div>
  )
}

function ItemRow({ item }: { item: import('../../types/cms').CmsSectionItem }) {
  const [title, setTitle] = useState(item.title ?? '')
  const [desc, setDesc] = useState(item.description ?? '')
  const [icon, setIcon] = useState(item.icon ?? '')
  const [extra, setExtra] = useState(JSON.stringify(item.extraData ?? {}, null, 2))

  const save = async () => {
    let extraData: object = {}
    try {
      extraData = JSON.parse(extra)
    } catch {
      alert('extraData JSON')
      return
    }
    await adminApi(`/items/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description: desc, icon: icon || null, extraData }),
    })
    window.location.reload()
  }

  const del = async () => {
    if (!confirm('Sil?')) return
    await adminApi(`/items/${item.id}`, { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <div className="border border-gray-100 rounded-lg p-3 space-y-2 bg-slate-50/50">
      <input className="w-full border rounded px-2 py-1 text-sm" placeholder="Başlık" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="w-full border rounded px-2 py-1 text-sm" placeholder="Açıklama" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <input className="w-full border rounded px-2 py-1 text-sm font-mono" placeholder="icon (code, globe…)" value={icon} onChange={(e) => setIcon(e.target.value)} />
      <textarea className="w-full border rounded px-2 py-1 text-xs font-mono h-20" placeholder="extraData JSON" value={extra} onChange={(e) => setExtra(e.target.value)} />
      <div className="flex gap-2">
        <button type="button" className="text-xs px-3 py-1 bg-accent-blue text-white rounded" onClick={save}>
          Kaydet
        </button>
        <button type="button" className="text-xs text-red-600" onClick={del}>
          Sil
        </button>
      </div>
    </div>
  )
}

function FaqEditor({ pageId, faqs, onReload }: { pageId: string; faqs: CmsFaq[]; onReload: () => void }) {
  const add = async () => {
    const q = window.prompt('Soru') ?? ''
    const a = window.prompt('Cevap') ?? ''
    if (!q) return
    await adminApi('/faqs', { method: 'POST', body: JSON.stringify({ pageId, question: q, answer: a }) })
    onReload()
  }

  return (
    <div className="space-y-3 mb-8">
      <button type="button" onClick={add} className="text-sm font-semibold text-accent-blue">
        + SSS ekle
      </button>
      {faqs.map((f) => (
        <FaqRow key={f.id} faq={f} onReload={onReload} />
      ))}
    </div>
  )
}

function FaqRow({ faq, onReload }: { faq: CmsFaq; onReload: () => void }) {
  const [q, setQ] = useState(faq.question)
  const [a, setA] = useState(faq.answer)
  const save = async () => {
    await adminApi(`/faqs/${faq.id}`, { method: 'PUT', body: JSON.stringify({ question: q, answer: a }) })
    onReload()
  }
  const del = async () => {
    if (!confirm('Sil?')) return
    await adminApi(`/faqs/${faq.id}`, { method: 'DELETE' })
    onReload()
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
      <input className="w-full border rounded-lg px-3 py-2 text-sm font-semibold" value={q} onChange={(e) => setQ(e.target.value)} />
      <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={a} onChange={(e) => setA(e.target.value)} />
      <div className="flex gap-2">
        <button type="button" className="text-sm px-3 py-1 bg-slate-900 text-white rounded-lg" onClick={save}>
          Kaydet
        </button>
        <button type="button" className="text-sm text-red-600" onClick={del}>
          Sil
        </button>
      </div>
    </div>
  )
}
