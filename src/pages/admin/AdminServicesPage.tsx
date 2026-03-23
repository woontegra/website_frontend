import { useState, useEffect } from 'react'
import { servicesApi, type Service } from '../../api/services'
import { Trash2, Plus, Edit2 } from 'lucide-react'

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const data = await servicesApi.getAll()
      setServices(data)
    } catch (error) {
      console.error('Hizmetler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await servicesApi.update(editingId, formData)
      } else {
        await servicesApi.create(formData)
      }
      setFormData({ title: '', description: '', icon: '' })
      setShowForm(false)
      setEditingId(null)
      loadServices()
    } catch (error) {
      console.error('Hizmet kaydedilemedi:', error)
    }
  }

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return
    try {
      await servicesApi.delete(id)
      loadServices()
    } catch (error) {
      console.error('Hizmet silinemedi:', error)
    }
  }

  const handleCancel = () => {
    setFormData({ title: '', description: '', icon: '' })
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
          <h1 className="text-3xl font-bold text-slate-900">Hizmetler</h1>
          <p className="text-gray-600 mt-1">Sitede gösterilecek hizmetleri yönetin</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ title: '', description: '', icon: '' })
          }}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Yeni Hizmet
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {editingId ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                rows={4}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-slate-900 focus:outline-none focus:border-green-500 transition-colors text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                İkon (Lucide icon adı)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="örn: Code, Smartphone, Globe"
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-slate-900 focus:outline-none focus:border-green-500 transition-colors text-lg"
                required
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
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:border-green-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500 flex-1 font-medium">İkon: {service.icon}</span>
              <button
                onClick={() => handleEdit(service)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400">
          Henüz hizmet eklenmemiş. Yeni hizmet eklemek için yukarıdaki butona tıklayın.
        </div>
      )}
    </div>
  )
}
