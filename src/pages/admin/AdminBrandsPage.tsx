import { useState, useEffect } from 'react'
import { brandsApi, type Brand } from '../../api/brands'
import { Trash2, Plus, Edit2, ExternalLink } from 'lucide-react'

export function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    url: '',
  })

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const data = await brandsApi.getAll()
      setBrands(data)
    } catch (error) {
      console.error('Markalar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await brandsApi.update(editingId, formData)
      } else {
        await brandsApi.create(formData)
      }
      setFormData({ name: '', description: '', image: '', url: '' })
      setShowForm(false)
      setEditingId(null)
      loadBrands()
    } catch (error) {
      console.error('Marka kaydedilemedi:', error)
    }
  }

  const handleEdit = (brand: Brand) => {
    setFormData({
      name: brand.name,
      description: brand.description || '',
      image: brand.image,
      url: brand.url || '',
    })
    setEditingId(brand.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu markayı silmek istediğinizden emin misiniz?')) return
    try {
      await brandsApi.delete(id)
      loadBrands()
    } catch (error) {
      console.error('Marka silinemedi:', error)
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', description: '', image: '', url: '' })
    setShowForm(false)
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Markalar</h1>
          <p className="text-gray-600 mt-1">İş ortağı markalarını yönetin</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Yeni Marka
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {editingId ? 'Markayı Düzenle' : 'Yeni Marka Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Marka Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-slate-900 focus:outline-none focus:border-green-500 transition-colors text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-slate-900 focus:outline-none focus:border-green-500 transition-colors text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Logo URL veya Yol
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/brand-name.jpg veya https://example.com/logo.png"
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-slate-900 focus:outline-none focus:border-green-500 transition-colors text-lg"
                required
              />
              {formData.image && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2 font-semibold">Önizleme:</p>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="max-h-32 rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Web Sitesi (Opsiyonel)
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-slate-900 focus:outline-none focus:border-green-500 transition-colors text-lg"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-semibold shadow-lg shadow-green-500/20"
              >
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-slate-900 rounded-xl transition-colors font-semibold"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:border-green-500/50 transition-all"
          >
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-24 h-24 mb-4 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3C/svg%3E'
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{brand.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{brand.description}</p>
              {brand.url && (
                <a
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  Web Sitesi <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleEdit(brand)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(brand.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400">
          Henüz marka eklenmemiş. Yeni marka eklemek için yukarıdaki butona tıklayın.
        </div>
      )}
    </div>
  )
}
