import { useState, useEffect } from 'react'
import { Trash2, Eye } from 'lucide-react'

interface Quote {
  id: number
  type: string
  description: string
  budget: string
  timeline: string
  name: string
  email: string
  phone: string
  company: string
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

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setQuotes(data)
      }
    } catch (error) {
      console.error('Teklifler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteQuote = async (id: number) => {
    if (!confirm('Bu teklifi silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
      })
      if (response.ok) {
        setQuotes(quotes.filter((q) => q.id !== id))
      }
    } catch (error) {
      console.error('Teklif silinemedi:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Teklif Talepleri</h1>
        <div className="text-sm text-gray-600">
          Toplam {quotes.length} teklif
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Henüz teklif talebi yok.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Tarih
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Ad Soyad
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Proje Türü
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Bütçe
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  İletişim
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(quote.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{quote.name}</div>
                    {quote.company && (
                      <div className="text-sm text-gray-600">{quote.company}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      {projectTypeLabels[quote.type] || quote.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {quote.budget}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{quote.email}</div>
                    <div className="text-sm text-gray-600">{quote.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedQuote(quote)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Detayları Gör"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteQuote(quote.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Teklif Detayı</h2>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Proje Türü
                </label>
                <p className="mt-2 text-lg text-slate-900">
                  {projectTypeLabels[selectedQuote.type] || selectedQuote.type}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Proje Açıklaması
                </label>
                <p className="mt-2 text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {selectedQuote.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Bütçe
                  </label>
                  <p className="mt-2 text-slate-900">{selectedQuote.budget}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Zaman
                  </label>
                  <p className="mt-2 text-slate-900">{selectedQuote.timeline}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  İletişim Bilgileri
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Ad Soyad
                    </label>
                    <p className="text-slate-900">{selectedQuote.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      E-posta
                    </label>
                    <p className="text-slate-900">
                      <a
                        href={`mailto:${selectedQuote.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedQuote.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Telefon
                    </label>
                    <p className="text-slate-900">
                      <a
                        href={`tel:${selectedQuote.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedQuote.phone}
                      </a>
                    </p>
                  </div>
                  {selectedQuote.company && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Şirket
                      </label>
                      <p className="text-slate-900">{selectedQuote.company}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
                Talep Tarihi:{' '}
                {new Date(selectedQuote.createdAt).toLocaleString('tr-TR')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
