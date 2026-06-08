import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { buildApiUrl } from '../../config/api'
import { adminFetch } from '../../lib/adminAuth'

type Quote = {
  id: number
  projectType?: string
  service?: string
  brief?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  status?: string
  createdAt: string
}

const projectTypeLabels: Record<string, string> = {
  software: 'Yazılım Geliştirme',
  'web-design': 'Web Tasarım',
  ecommerce: 'E-Ticaret',
  saas: 'SaaS Ürün',
  trademark: 'Marka & Patent',
  consulting: 'Danışmanlık',
  game: 'Oyun Geliştirme',
}

export function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    setError('')
    try {
      const response = await adminFetch(buildApiUrl('/quotes'))
      const data = (await response.json()) as { success?: boolean; data?: Quote[] }
      if (response.ok && data.success && Array.isArray(data.data)) {
        setQuotes(data.data)
      } else {
        setQuotes([])
        setError('Teklifler yüklenemedi.')
      }
    } catch {
      setError('Bağlantı hatası')
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Teklif Talepleri</h1>
        <p className="mt-1 text-sm text-slate-500">Form üzerinden gelen teklif talepleri</p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>
      )}

      {quotes.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">Henüz teklif talebi yok.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">İsim</th>
                <th className="px-4 py-3 font-medium">E-posta</th>
                <th className="px-4 py-3 font-medium">Proje</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {new Date(quote.createdAt).toLocaleString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{quote.contactName}</td>
                  <td className="px-4 py-3 text-slate-600">{quote.contactEmail}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {projectTypeLabels[quote.projectType ?? ''] || quote.service || quote.projectType || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{quote.status || 'yeni'}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedQuote(quote)}
                      className="inline-flex items-center gap-1 text-emerald-700 hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      Görüntüle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedQuote && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Teklif Detayı</h2>
            <button type="button" onClick={() => setSelectedQuote(null)} className="text-sm text-slate-500 hover:text-slate-800">
              Kapat
            </button>
          </div>
          <p><strong>İsim:</strong> {selectedQuote.contactName}</p>
          <p><strong>E-posta:</strong> {selectedQuote.contactEmail}</p>
          {selectedQuote.contactPhone && <p><strong>Telefon:</strong> {selectedQuote.contactPhone}</p>}
          <p><strong>Proje türü:</strong> {projectTypeLabels[selectedQuote.projectType ?? ''] || selectedQuote.projectType || '—'}</p>
          {selectedQuote.service && <p><strong>Hizmet:</strong> {selectedQuote.service}</p>}
          {selectedQuote.brief && <p><strong>Özet:</strong> {selectedQuote.brief}</p>}
          <p className="text-sm text-slate-500">Not: Teklifler geçici bellekte tutulur; sunucu yeniden başlatılınca sıfırlanabilir.</p>
        </div>
      )}
    </div>
  )
}
