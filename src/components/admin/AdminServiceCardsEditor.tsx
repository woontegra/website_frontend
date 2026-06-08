import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { fetchPageContentBundle, savePageContentBundle } from '../../api/pageContentBundle'
import {
  defaultServiceCardsBundle,
  mergeServiceCards,
  SERVICE_CARDS_KEY,
  type ServiceCardConfig,
  type ServiceCardsBundle,
} from '../../data/serviceCardsContent'
import { GRADIENT_OPTIONS, ICON_OPTIONS } from '../../lib/iconRegistry'
import { AdminListEditorShell } from './AdminListEditorShell'

function newCard(): ServiceCardConfig {
  return {
    id: crypto.randomUUID(),
    title: 'Yeni Hizmet',
    description: '',
    tag: '',
    icon: 'Globe',
    href: '/iletisim',
    gradient: GRADIENT_OPTIONS[0],
    order: 0,
    enabled: true,
  }
}

export function AdminServiceCardsEditor() {
  const [bundle, setBundle] = useState<ServiceCardsBundle>(defaultServiceCardsBundle)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetchPageContentBundle(SERVICE_CARDS_KEY, defaultServiceCardsBundle, mergeServiceCards).then((data) => {
      setBundle(data)
      setLoading(false)
    })
  }, [])

  const updateCards = (cards: ServiceCardConfig[]) => setBundle({ cards: cards.map((c, i) => ({ ...c, order: i })) })

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const payload = mergeServiceCards(defaultServiceCardsBundle, bundle)
    const result = await savePageContentBundle(SERVICE_CARDS_KEY, payload)
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
      title="Hizmet Kartları"
      description="/hizmetler sayfasındaki kartlar. Görsel URL kullanılmaz; ikon setinden seçilir."
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => void handleSave()}
      onAdd={() => updateCards([...bundle.cards, newCard()])}
    >
      {bundle.cards.map((card, index) => (
        <div key={card.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col gap-1">
              <button type="button" disabled={index === 0} onClick={() => {
                const cards = [...bundle.cards]; [cards[index - 1], cards[index]] = [cards[index], cards[index - 1]]; updateCards(cards)
              }} className="text-slate-400 disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
              <button type="button" disabled={index === bundle.cards.length - 1} onClick={() => {
                const cards = [...bundle.cards]; [cards[index], cards[index + 1]] = [cards[index + 1], cards[index]]; updateCards(cards)
              }} className="text-slate-400 disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
            </div>
            <input className="input flex-1" value={card.title} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, title: e.target.value }; updateCards(cards)
            }} placeholder="Başlık" />
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={card.enabled} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, enabled: e.target.checked }; updateCards(cards)
            }} />Aktif</label>
            <button type="button" onClick={() => updateCards(bundle.cards.filter((_, i) => i !== index))} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
          <textarea className="textarea w-full" rows={2} value={card.description} onChange={(e) => {
            const cards = [...bundle.cards]; cards[index] = { ...card, description: e.target.value }; updateCards(cards)
          }} placeholder="Açıklama" />
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" value={card.tag} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, tag: e.target.value }; updateCards(cards)
            }} placeholder="Kısa etiket" />
            <input className="input font-mono text-xs" value={card.href} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, href: e.target.value }; updateCards(cards)
            }} placeholder="/link" />
            <select className="input" value={card.icon} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, icon: e.target.value }; updateCards(cards)
            }}>
              {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
            <select className="input" value={card.gradient} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, gradient: e.target.value }; updateCards(cards)
            }}>
              {GRADIENT_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      ))}
    </AdminListEditorShell>
  )
}
