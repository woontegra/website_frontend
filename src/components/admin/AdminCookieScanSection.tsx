import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { buildApiUrl } from '../../config/api'
import { adminFetch } from '../../lib/adminAuth'

type CookieInventoryRow = {
  id: string
  name: string
  domain: string
  path: string
  provider: string
  category: string
  purpose: string
  duration: string
  source: string
  firstSeenUrl: string
  httpOnly: boolean
  secure: boolean
  adminProvider: string | null
  adminCategory: string | null
  adminPurpose: string | null
  adminDurationLabel: string | null
}

type AdminCookieDashboard = {
  lastScannedAt: string | null
  totalCookies: number
  categoryCounts: Record<string, number>
  pageResults: Array<{ path: string; url: string; status: string; error?: string }>
  cookies: CookieInventoryRow[]
}

const CATEGORY_OPTIONS = ['necessary', 'analytics', 'marketing', 'functional', 'unknown'] as const

export function AdminCookieScanSection() {
  const [data, setData] = useState<AdminCookieDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    adminProvider: '',
    adminCategory: 'unknown',
    adminPurpose: '',
    adminDurationLabel: '',
  })

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await adminFetch(buildApiUrl('/api/admin/cookies'))
      if (!response.ok) throw new Error('Çerez verisi alınamadı')
      const json = (await response.json()) as AdminCookieDashboard
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yükleme hatası')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const runScan = async () => {
    setScanning(true)
    setError('')
    try {
      const response = await adminFetch(buildApiUrl('/api/admin/cookies/scan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(payload.error || 'Tarama başarısız')
      }
      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tarama hatası')
    } finally {
      setScanning(false)
    }
  }

  const startEdit = (row: CookieInventoryRow) => {
    setEditingId(row.id)
    setEditForm({
      adminProvider: row.adminProvider ?? row.provider,
      adminCategory: row.adminCategory ?? row.category,
      adminPurpose: row.adminPurpose ?? row.purpose,
      adminDurationLabel: row.adminDurationLabel ?? row.duration,
    })
  }

  const saveEdit = async () => {
    if (!editingId) return
    try {
      const response = await adminFetch(buildApiUrl(`/api/admin/cookies/${editingId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (!response.ok) throw new Error('Kayıt güncellenemedi')
      setEditingId(null)
      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme hatası')
    }
  }

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Çerez Taraması</h3>
          <p className="mt-1 text-xs text-slate-500">
            Playwright ile gerçek site taraması. Varsayılan liste kullanılmaz.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void runScan()}
          disabled={scanning}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Taranıyor…' : 'Siteyi Tara'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-600">Yükleniyor…</p>
      ) : data ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Son tarama" value={data.lastScannedAt ? new Date(data.lastScannedAt).toLocaleString('tr-TR') : '—'} />
            <StatCard label="Tespit edilen çerez" value={String(data.totalCookies)} />
            <StatCard label="Analitik" value={String(data.categoryCounts.analytics ?? 0)} />
            <StatCard label="Pazarlama" value={String(data.categoryCounts.marketing ?? 0)} />
          </div>

          {data.pageResults.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Sayfa durumu</p>
              <div className="flex flex-wrap gap-2">
                {data.pageResults.map((page) => (
                  <span
                    key={page.path}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      page.status === 'ok'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                    title={page.error || page.url}
                  >
                    {page.path} {page.status === 'ok' ? '✓' : 'erişilemedi'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2">Çerez adı</th>
                  <th className="px-3 py-2">Sağlayıcı</th>
                  <th className="px-3 py-2">Kategori</th>
                  <th className="px-3 py-2">Amaç</th>
                  <th className="px-3 py-2">Süre</th>
                  <th className="px-3 py-2">Domain</th>
                  <th className="px-3 py-2">Kaynak</th>
                  <th className="px-3 py-2">İlk sayfa</th>
                  <th className="px-3 py-2">HttpOnly</th>
                  <th className="px-3 py-2">Secure</th>
                  <th className="px-3 py-2">Düzenle</th>
                </tr>
              </thead>
              <tbody>
                {data.cookies.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 align-top">
                    <td className="px-3 py-2 font-medium">{row.name}</td>
                    <td className="px-3 py-2">{row.adminProvider || row.provider || '—'}</td>
                    <td className="px-3 py-2">{row.adminCategory || row.category}</td>
                    <td className="px-3 py-2 max-w-xs">{row.adminPurpose || row.purpose}</td>
                    <td className="px-3 py-2">{row.adminDurationLabel || row.duration}</td>
                    <td className="px-3 py-2">{row.domain}</td>
                    <td className="px-3 py-2">{row.source}</td>
                    <td className="px-3 py-2 max-w-[10rem] truncate" title={row.firstSeenUrl}>
                      {row.firstSeenUrl}
                    </td>
                    <td className="px-3 py-2">{row.httpOnly ? 'Evet' : 'Hayır'}</td>
                    <td className="px-3 py-2">{row.secure ? 'Evet' : 'Hayır'}</td>
                    <td className="px-3 py-2">
                      <button type="button" className="text-green-700 hover:underline" onClick={() => startEdit(row)}>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      {editingId && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
          <h4 className="font-medium text-slate-900">Çerez düzenle</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Sağlayıcı</label>
              <input
                className="input w-full"
                value={editForm.adminProvider}
                onChange={(e) => setEditForm({ ...editForm, adminProvider: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Kategori</label>
              <select
                className="input w-full"
                value={editForm.adminCategory}
                onChange={(e) => setEditForm({ ...editForm, adminCategory: e.target.value })}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Amaç</label>
            <textarea
              className="textarea w-full"
              rows={3}
              value={editForm.adminPurpose}
              onChange={(e) => setEditForm({ ...editForm, adminPurpose: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Süre açıklaması (kullanıcıya gösterilen)</label>
            <input
              className="input w-full"
              value={editForm.adminDurationLabel}
              onChange={(e) => setEditForm({ ...editForm, adminDurationLabel: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn btn-primary" onClick={() => void saveEdit()}>
              Kaydet
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}
