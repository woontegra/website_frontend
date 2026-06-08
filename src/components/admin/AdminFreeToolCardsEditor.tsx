import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { fetchPageContentBundle, savePageContentBundle } from '../../api/pageContentBundle'
import {
  defaultFreeToolCardsBundle,
  FREE_TOOL_CARDS_KEY,
  mergeFreeToolCards,
  type FreeToolCardConfig,
  type FreeToolCardsBundle,
} from '../../data/freeToolCardsContent'
import { AdminListEditorShell } from './AdminListEditorShell'

function newCard(): FreeToolCardConfig {
  return {
    id: crypto.randomUUID(),
    name: 'Yeni Araç',
    description: '',
    status: 'coming-soon',
    buttonText: 'Yakında',
    href: '#',
    imageKey: 'none',
    order: 0,
    enabled: true,
  }
}

export function AdminFreeToolCardsEditor() {
  const [bundle, setBundle] = useState<FreeToolCardsBundle>(defaultFreeToolCardsBundle)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetchPageContentBundle(FREE_TOOL_CARDS_KEY, defaultFreeToolCardsBundle, mergeFreeToolCards).then((data) => {
      setBundle(data)
      setLoading(false)
    })
  }, [])

  const updateCards = (cards: FreeToolCardConfig[]) => setBundle({ cards: cards.map((c, i) => ({ ...c, order: i })) })

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const payload = mergeFreeToolCards(defaultFreeToolCardsBundle, bundle)
    const result = await savePageContentBundle(FREE_TOOL_CARDS_KEY, payload)
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
      title="Ücretsiz Araç Kartları"
      description="/ucretsiz-araclar sayfası araç kartları. Görsel yalnızca sabit asset anahtarı ile seçilir."
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
            <input className="input flex-1" value={card.name} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, name: e.target.value }; updateCards(cards)
            }} />
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={card.enabled} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, enabled: e.target.checked }; updateCards(cards)
            }} />Aktif</label>
            <button type="button" onClick={() => updateCards(bundle.cards.filter((_, i) => i !== index))} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
          <textarea className="textarea w-full" rows={2} value={card.description} onChange={(e) => {
            const cards = [...bundle.cards]; cards[index] = { ...card, description: e.target.value }; updateCards(cards)
          }} />
          <div className="grid gap-3 md:grid-cols-2">
            <select className="input" value={card.status} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, status: e.target.value as FreeToolCardConfig['status'] }; updateCards(cards)
            }}>
              <option value="active">Yayında</option>
              <option value="coming-soon">Yakında</option>
              <option value="disabled">Pasif</option>
            </select>
            <select className="input" value={card.imageKey} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, imageKey: e.target.value as FreeToolCardConfig['imageKey'] }; updateCards(cards)
            }}>
              <option value="none">Görsel yok</option>
              <option value="sifre-kasasi">Şifre Kasası ekran görüntüsü</option>
            </select>
            <input className="input" value={card.buttonText} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, buttonText: e.target.value }; updateCards(cards)
            }} placeholder="Buton metni" />
            <input className="input font-mono text-xs" value={card.href} onChange={(e) => {
              const cards = [...bundle.cards]; cards[index] = { ...card, href: e.target.value }; updateCards(cards)
            }} placeholder="/link" />
          </div>
        </div>
      ))}
    </AdminListEditorShell>
  )
}
