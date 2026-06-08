import { useEffect, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { fetchPageContentBundle, savePageContentBundle } from '../../api/pageContentBundle'
import {
  defaultSolutionBenefitCardsBundle,
  defaultSolutionCardsBundle,
  mergeSolutionBenefitCards,
  mergeSolutionCards,
  SOLUTION_BENEFIT_CARDS_KEY,
  SOLUTION_CARDS_KEY,
  type SolutionBenefitCardConfig,
  type SolutionCardConfig,
} from '../../data/solutionCardsContent'
import { GRADIENT_OPTIONS, ICON_OPTIONS } from '../../lib/iconRegistry'
import { AdminListEditorShell } from './AdminListEditorShell'

function newSolutionCard(): SolutionCardConfig {
  return { id: crypto.randomUUID(), title: 'Yeni Çözüm', description: '', icon: 'Boxes', href: '/iletisim', gradient: GRADIENT_OPTIONS[0], order: 0, enabled: true }
}

function newBenefitCard(): SolutionBenefitCardConfig {
  return { id: crypto.randomUUID(), title: 'Yeni Kazanım', description: '', icon: 'LayoutDashboard', order: 0, enabled: true }
}

export function AdminSolutionCardsEditor() {
  const [cards, setCards] = useState<SolutionCardConfig[]>(defaultSolutionCardsBundle.cards)
  const [benefits, setBenefits] = useState<SolutionBenefitCardConfig[]>(defaultSolutionBenefitCardsBundle.cards)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void Promise.all([
      fetchPageContentBundle(SOLUTION_CARDS_KEY, defaultSolutionCardsBundle, mergeSolutionCards),
      fetchPageContentBundle(SOLUTION_BENEFIT_CARDS_KEY, defaultSolutionBenefitCardsBundle, mergeSolutionBenefitCards),
    ]).then(([cardsBundle, benefitsBundle]) => {
      setCards(cardsBundle.cards)
      setBenefits(benefitsBundle.cards)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const cardsPayload = mergeSolutionCards(defaultSolutionCardsBundle, { cards })
    const benefitsPayload = mergeSolutionBenefitCards(defaultSolutionBenefitCardsBundle, { cards: benefits })
    const [r1, r2] = await Promise.all([
      savePageContentBundle(SOLUTION_CARDS_KEY, cardsPayload),
      savePageContentBundle(SOLUTION_BENEFIT_CARDS_KEY, benefitsPayload),
    ])
    setSaving(false)
    if (r1.success && r2.success) {
      setCards(cardsPayload.cards)
      setBenefits(benefitsPayload.cards)
      setMessage('✓ Kaydedildi')
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage(`Hata: ${r1.message ?? r2.message ?? 'Kayıt başarısız'}`)
    }
  }

  const renderCardList = <T extends { id: string; enabled: boolean }>(
    list: T[],
    setList: (next: T[]) => void,
    renderFields: (item: T, index: number) => ReactNode,
  ) => list.map((item, index) => (
    <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-col gap-1">
          <button type="button" disabled={index === 0} onClick={() => {
            const next = [...list]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; setList(next)
          }} className="text-slate-400 disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
          <button type="button" disabled={index === list.length - 1} onClick={() => {
            const next = [...list]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; setList(next)
          }} className="text-slate-400 disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
        </div>
        <label className="flex items-center gap-1 text-xs ml-auto"><input type="checkbox" checked={item.enabled} onChange={(e) => {
          const next = [...list]; next[index] = { ...item, enabled: e.target.checked } as T; setList(next)
        }} />Aktif</label>
        <button type="button" onClick={() => setList(list.filter((_, i) => i !== index))} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
      </div>
      {renderFields(item, index)}
    </div>
  ))

  return (
    <div className="space-y-8">
      <AdminListEditorShell
        title="Çözüm Kartları"
        description="/cozumler sayfası çözüm kartları ve kazanım kartları."
        loading={loading}
        saving={saving}
        message={message}
        onSave={() => void handleSave()}
        onAdd={() => setCards([...cards, newSolutionCard()])}
        addLabel="+ Çözüm kartı ekle"
      >
        {renderCardList(cards, setCards, (card, index) => (
          <>
            <input className="input w-full" value={card.title} onChange={(e) => {
              const next = [...cards]; next[index] = { ...card, title: e.target.value }; setCards(next)
            }} />
            <textarea className="textarea w-full" rows={2} value={card.description} onChange={(e) => {
              const next = [...cards]; next[index] = { ...card, description: e.target.value }; setCards(next)
            }} />
            <div className="grid gap-3 md:grid-cols-2">
              <input className="input font-mono text-xs" value={card.href} onChange={(e) => {
                const next = [...cards]; next[index] = { ...card, href: e.target.value }; setCards(next)
              }} />
              <select className="input" value={card.icon} onChange={(e) => {
                const next = [...cards]; next[index] = { ...card, icon: e.target.value }; setCards(next)
              }}>{ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}</select>
              <select className="input md:col-span-2" value={card.gradient} onChange={(e) => {
                const next = [...cards]; next[index] = { ...card, gradient: e.target.value }; setCards(next)
              }}>{GRADIENT_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}</select>
            </div>
          </>
        ))}
      </AdminListEditorShell>

      {!loading && (
        <div className="card space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Kazanım Kartları</h3>
          {renderCardList(benefits, setBenefits, (card, index) => (
            <>
              <input className="input w-full" value={card.title} onChange={(e) => {
                const next = [...benefits]; next[index] = { ...card, title: e.target.value }; setBenefits(next)
              }} />
              <textarea className="textarea w-full" rows={2} value={card.description} onChange={(e) => {
                const next = [...benefits]; next[index] = { ...card, description: e.target.value }; setBenefits(next)
              }} />
              <select className="input" value={card.icon} onChange={(e) => {
                const next = [...benefits]; next[index] = { ...card, icon: e.target.value }; setBenefits(next)
              }}>{ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}</select>
            </>
          ))}
          <button type="button" onClick={() => setBenefits([...benefits, newBenefitCard()])} className="text-sm text-emerald-700 hover:underline">+ Kazanım kartı ekle</button>
        </div>
      )}
    </div>
  )
}
