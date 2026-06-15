import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  legalDocumentsAdminApi,
  type LegalDocumentAdminRow,
  type LegalDocumentType,
} from '../../api/legal-documents-admin'

const TYPE_LABELS: Record<LegalDocumentType, string> = {
  PRE_INFORMATION: 'Ön bilgilendirme',
  DISTANCE_SALES: 'Mesafeli satış',
  KVKK_CLARIFICATION: 'KVKK aydınlatma',
  EXPLICIT_CONSENT: 'Açık rıza',
  COMMERCIAL_ELECTRONIC_MESSAGE: 'Ticari elektronik ileti',
  TERMS_OF_USE: 'Kullanım şartları',
  PRIVACY_POLICY: 'Gizlilik politikası',
}

const ALL_TYPES = Object.keys(TYPE_LABELS) as LegalDocumentType[]

const emptyForm = {
  type: 'PRE_INFORMATION' as LegalDocumentType,
  title: '',
  content: '',
  version: 1,
  isActive: true,
}

const placeholderHint =
  'Metinde kullanılabilir: customerName, customerEmail, orderNo, orderTotal, productList, sellerTitle, sellerEmail, sellerAddress, sellerPhone (çift süslü parantez içinde).'

export function AdminLegalDocumentsPage() {
  const [rows, setRows] = useState<LegalDocumentAdminRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setError(null)
    try {
      setLoading(true)
      const data = await legalDocumentsAdminApi.list()
      setRows(data)
    } catch {
      setError('Liste yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const startCreate = () => {
    setMode('create')
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  const startEdit = (r: LegalDocumentAdminRow) => {
    setMode('edit')
    setEditingId(r.id)
    setForm({
      type: r.type,
      title: r.title,
      content: r.content,
      version: r.version,
      isActive: r.isActive,
    })
  }

  const cancelForm = () => {
    setMode('list')
    setEditingId(null)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (mode === 'create') {
        await legalDocumentsAdminApi.create({
          type: form.type,
          title: form.title,
          content: form.content,
          version: form.version,
          isActive: form.isActive,
        })
      } else if (mode === 'edit' && editingId) {
        await legalDocumentsAdminApi.patch(editingId, {
          title: form.title,
          content: form.content,
          version: form.version,
          isActive: form.isActive,
        })
      }
      await load()
      cancelForm()
    } catch {
      setError('Kayıt başarısız.')
    } finally {
      setSaving(false)
    }
  }

  const onDeactivate = async (id: string) => {
    if (!window.confirm('Bu belgeyi pasifleştirmek istiyor musunuz?')) return
    try {
      await legalDocumentsAdminApi.deactivate(id)
      await load()
    } catch {
      setError('Pasifleştirilemedi.')
    }
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link to="/admin" className="text-sm text-accent-blue hover:underline">
            ← Dashboard
          </Link>
          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Yasal metinler (e-ticaret)</h1>
          <p className="mt-1 text-sm text-slate-600">Checkout ve sipariş snapshot’larında kullanılan belgeler.</p>
        </div>
        {mode === 'list' && (
          <button type="button" className="w-full shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white sm:w-auto" onClick={startCreate}>
            Yeni belge
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {mode !== 'list' && (
        <form onSubmit={onSubmit} className="w-full max-w-3xl min-w-0 space-y-4 rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
          <h2 className="font-semibold text-slate-900">{mode === 'create' ? 'Yeni belge' : 'Belgeyi düzenle'}</h2>
          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Tip</label>
              <select
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as LegalDocumentType }))}
              >
                {ALL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          )}
          {mode === 'edit' && (
            <p className="text-sm text-slate-600">
              Tip: <strong>{TYPE_LABELS[form.type]}</strong> (değiştirilemez)
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Başlık</label>
            <input
              required
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">İçerik</label>
            <p className="mt-1 text-xs text-slate-500">{placeholderHint}</p>
            <textarea
              required
              rows={14}
              className="mt-2 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Versiyon</label>
              <input
                type="number"
                min={1}
                className="mt-1 w-28 rounded border border-slate-300 px-3 py-2"
                value={form.version}
                onChange={(e) => setForm((f) => ({ ...f, version: Math.max(1, Number(e.target.value) || 1) }))}
              />
            </div>
            <label className="mt-6 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              Aktif
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
            <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm" onClick={cancelForm}>
              İptal
            </button>
          </div>
        </form>
      )}

      {mode === 'list' && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          {loading ? (
            <p className="p-6 text-slate-600">Yükleniyor…</p>
          ) : (
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                <tr>
                  <th className="px-4 py-3">Tip</th>
                  <th className="px-4 py-3">Başlık</th>
                  <th className="px-4 py-3">v</th>
                  <th className="px-4 py-3">Aktif</th>
                  <th className="px-4 py-3">Güncellendi</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-700">{TYPE_LABELS[r.type]}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{r.title}</td>
                    <td className="px-4 py-3">{r.version}</td>
                    <td className="px-4 py-3">{r.isActive ? 'Evet' : 'Hayır'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(r.updatedAt).toLocaleString('tr-TR')}</td>
                    <td className="space-x-2 px-4 py-3">
                      <button type="button" className="text-accent-blue hover:underline" onClick={() => startEdit(r)}>
                        Düzenle
                      </button>
                      {r.isActive && (
                        <button type="button" className="text-red-700 hover:underline" onClick={() => void onDeactivate(r.id)}>
                          Pasifleştir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && rows.length === 0 && <p className="p-6 text-center text-slate-500">Kayıt yok.</p>}
        </div>
      )}
    </div>
  )
}
