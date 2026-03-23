import { useState, useEffect } from 'react'
import { Save, Upload } from 'lucide-react'

interface Settings {
  siteName: string
  logo: string
  seoTitle: string
  seoDescription: string
  gaId: string
  fbPixelId: string
  smtpHost: string
  smtpUser: string
  smtpPassword: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'Woontegra',
    logo: '',
    seoTitle: 'Woontegra - Yazılım ve Dijital Çözümler',
    seoDescription: 'Yazılım geliştirme, e-ticaret ve dijital sistemler',
    gaId: '',
    fbPixelId: '',
    smtpHost: '',
    smtpUser: '',
    smtpPassword: '',
    contactEmail: 'info@woontegra.com',
    contactPhone: '0532 317 17 55',
    contactAddress: 'İskele Mahallesi Bademli Caddesi 43/6 Datça-Muğla',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage('Ayarlar kaydedildi ✓')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Hata oluştu')
      }
    } catch (error) {
      setMessage('Bağlantı hatası')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setSettings({ ...settings, logo: data.url })
      }
    } catch (error) {
      console.error('Logo yüklenemedi:', error)
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
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Site Ayarları</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes('✓') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* GENEL */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Genel</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Site Adı
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Logo
            </label>
            <div className="flex items-center gap-4">
              {settings.logo && (
                <img src={settings.logo} alt="Logo" className="h-16 w-auto" />
              )}
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer transition-colors">
                <Upload className="w-5 h-5" />
                Logo Yükle
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">SEO</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Varsayılan Title
            </label>
            <input
              type="text"
              value={settings.seoTitle}
              onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Varsayılan Description
            </label>
            <textarea
              value={settings.seoDescription}
              onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ANALYTICS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Analytics</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Google Analytics ID
            </label>
            <input
              type="text"
              value={settings.gaId}
              onChange={(e) => setSettings({ ...settings, gaId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
            <p className="text-sm text-gray-600 mt-2">
              Örnek: G-XXXXXXXXXX
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Facebook Pixel ID
            </label>
            <input
              type="text"
              value={settings.fbPixelId}
              onChange={(e) => setSettings({ ...settings, fbPixelId: e.target.value })}
              placeholder="123456789012345"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SMTP */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Mail (SMTP)</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
              placeholder="smtp.gmail.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              SMTP User
            </label>
            <input
              type="text"
              value={settings.smtpUser}
              onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* İLETİŞİM */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">İletişim Bilgileri</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Telefon
            </label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Adres
            </label>
            <input
              type="text"
              value={settings.contactAddress}
              onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
