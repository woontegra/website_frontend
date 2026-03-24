import { useState, useEffect } from 'react'
import { 
  Save, Settings, Palette, Mail, Phone, MapPin, Globe, 
  Search, BarChart, Wrench, Upload, X,
  MessageSquare, Image as ImageIcon, Tag,
  Trash2, RefreshCw, AlertCircle
} from 'lucide-react'
import { getApiUrl } from '../../config/api'

interface SiteSettings {
  // General
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  darkModeLogo: string
  language: string
  currency: string
  
  // Brand & Visual
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  borderRadius: string
  buttonStyle: string
  
  // Contact
  contactEmail: string
  contactPhone: string
  contactWhatsApp: string
  contactAddress: string
  googleMapsEmbed: string
  
  // SEO - General
  defaultTitle: string
  defaultDescription: string
  defaultKeywords: string[]
  canonicalUrl: string
  
  // SEO - Open Graph
  ogTitle: string
  ogDescription: string
  ogImage: string
  
  // SEO - Twitter
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  
  // SEO - Index
  indexable: boolean
  followable: boolean
  
  // SEO - Schema
  organizationName: string
  organizationLogo: string
  schemaJson: string
  
  // SEO - Robots
  robotsTxt: string
  
  // Analytics
  googleAnalyticsId: string
  googleTagManagerId: string
  facebookPixelId: string
  tiktokPixelId: string
  hotjarId: string
  customHeadScript: string
  customFooterScript: string
  
  // SMTP
  smtpHost: string
  smtpPort: string
  smtpSecure: boolean
  smtpUser: string
  smtpPassword: string
  
  // System
  maintenanceMode: boolean
  maintenanceMessage: string
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern Sans)' },
  { value: 'Poppins', label: 'Poppins (Friendly)' },
  { value: 'Roboto', label: 'Roboto (Clean)' },
  { value: 'Montserrat', label: 'Montserrat (Elegant)' },
  { value: 'Open Sans', label: 'Open Sans (Classic)' },
]

const BORDER_RADIUS_OPTIONS = [
  { value: 'none', label: 'Sharp (0px)' },
  { value: 'sm', label: 'Small (4px)' },
  { value: 'md', label: 'Medium (8px)' },
  { value: 'lg', label: 'Large (12px)' },
  { value: 'xl', label: 'Extra Large (16px)' },
]

const BUTTON_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
]

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Woontegra',
    siteDescription: 'Yazılım, e-ticaret ve dijital sistemler',
    logo: '',
    favicon: '',
    darkModeLogo: '',
    language: 'tr',
    currency: 'TRY',
    
    primaryColor: '#16a34a',
    secondaryColor: '#0ea5e9',
    fontFamily: 'Inter',
    borderRadius: 'lg',
    buttonStyle: 'solid',
    
    contactEmail: 'info@woontegra.com',
    contactPhone: '0532 317 17 55',
    contactWhatsApp: '905323171755',
    contactAddress: 'İskele Mahallesi Bademli Caddesi 43/6 Datça-Muğla',
    googleMapsEmbed: '',
    
    defaultTitle: 'Woontegra | Yazılım, Dijital Ticaret ve Teknoloji Çözümleri',
    defaultDescription: 'Yazılım geliştirme, SaaS, e-ticaret, web tasarım, marka ve patent vekilliği, oyun geliştirme. Tek çatı altında teknoloji çözümleri.',
    defaultKeywords: [],
    canonicalUrl: 'https://woontegra.com',
    
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    
    indexable: true,
    followable: true,
    
    organizationName: 'Woontegra',
    organizationLogo: '',
    schemaJson: '',
    robotsTxt: '',
    
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    tiktokPixelId: '',
    hotjarId: '',
    customHeadScript: '',
    customFooterScript: '',
    
    smtpHost: '',
    smtpPort: '587',
    smtpSecure: true,
    smtpUser: '',
    smtpPassword: '',
    
    maintenanceMode: false,
    maintenanceMessage: 'Site bakımda. Kısa süre sonra geri döneceğiz.',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [newKeyword, setNewKeyword] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const API_URL = getApiUrl()
      const response = await fetch(`${API_URL}/api/settings/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...settings, ...data })
      }
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const API_URL = getApiUrl()
      const response = await fetch(`${API_URL}/api/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Kaydetme sırasında hata oluştu' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası' })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteSettings) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const API_URL = getApiUrl()
      const response = await fetch(`${API_URL}/api/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setSettings({ ...settings, [field]: data.url })
      }
    } catch (error) {
      console.error('Dosya yüklenemedi:', error)
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !settings.defaultKeywords.includes(newKeyword.trim())) {
      setSettings({
        ...settings,
        defaultKeywords: [...settings.defaultKeywords, newKeyword.trim()]
      })
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setSettings({
      ...settings,
      defaultKeywords: settings.defaultKeywords.filter(k => k !== keyword)
    })
  }

  const handleTestEmail = async () => {
    try {
      const API_URL = getApiUrl()
      const response = await fetch(`${API_URL}/api/settings/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
        body: JSON.stringify({
          to: settings.contactEmail,
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpSecure: settings.smtpSecure,
          smtpUser: settings.smtpUser,
          smtpPassword: settings.smtpPassword,
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Test e-postası gönderildi!' })
      } else {
        setMessage({ type: 'error', text: 'E-posta gönderilemedi' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası' })
    }
  }

  const handleClearCache = async () => {
    try {
      const API_URL = getApiUrl()
      const response = await fetch(`${API_URL}/api/settings/clear-cache`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Cache temizlendi!' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Cache temizlenemedi' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Ayarlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER - STICKY */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-green-600" />
              Site Ayarları
            </h1>
            <p className="text-slate-600 mt-1">Tüm site ayarlarını buradan yönetin</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition-all shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <AlertCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}
      </div>

      {/* 2 COLUMN GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          
          {/* 1. GENEL AYARLAR */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-green-600" />
              Genel Ayarlar
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Site Açıklaması
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  {settings.logo && (
                    <div className="relative group">
                      <img src={settings.logo} alt="Logo" className="h-16 w-auto rounded-lg border border-gray-200" />
                      <button
                        onClick={() => setSettings({ ...settings, logo: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer transition-all">
                    <Upload className="w-5 h-5" />
                    Logo Yükle
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Favicon
                </label>
                <div className="flex items-center gap-4">
                  {settings.favicon && (
                    <div className="relative group">
                      <img src={settings.favicon} alt="Favicon" className="h-12 w-12 rounded-lg border border-gray-200" />
                      <button
                        onClick={() => setSettings({ ...settings, favicon: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer transition-all">
                    <Upload className="w-5 h-5" />
                    Favicon Yükle
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'favicon')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dark Mode Logo (Opsiyonel)
                </label>
                <div className="flex items-center gap-4">
                  {settings.darkModeLogo && (
                    <div className="relative group">
                      <img src={settings.darkModeLogo} alt="Dark Logo" className="h-16 w-auto rounded-lg border border-gray-200 bg-slate-900 p-2" />
                      <button
                        onClick={() => setSettings({ ...settings, darkModeLogo: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer transition-all">
                    <Upload className="w-5 h-5" />
                    Dark Logo Yükle
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'darkModeLogo')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Dil
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Para Birimi
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="TRY">TRY (₺)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 2. MARKA & GÖRSEL AYARLAR */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Palette className="w-6 h-6 text-green-600" />
              Marka & Görsel Ayarlar
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Font Ailesi
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                >
                  {FONT_OPTIONS.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Border Radius
                  </label>
                  <select
                    value={settings.borderRadius}
                    onChange={(e) => setSettings({ ...settings, borderRadius: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  >
                    {BORDER_RADIUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Button Style
                  </label>
                  <select
                    value={settings.buttonStyle}
                    onChange={(e) => setSettings({ ...settings, buttonStyle: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  >
                    {BUTTON_STYLE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. İLETİŞİM BİLGİLERİ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 text-green-600" />
              İletişim Bilgileri
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Telefon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  WhatsApp
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={settings.contactWhatsApp}
                    onChange={(e) => setSettings({ ...settings, contactWhatsApp: e.target.value })}
                    placeholder="905321234567"
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Ülke kodu ile birlikte (örn: 905321234567)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Adres
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={settings.contactAddress}
                    onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                    rows={2}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Google Maps Embed Link
                </label>
                <input
                  type="url"
                  value={settings.googleMapsEmbed}
                  onChange={(e) => setSettings({ ...settings, googleMapsEmbed: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* 4. SEO (GELİŞMİŞ) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-green-600" />
              SEO Ayarları
            </h2>
            
            {/* GENEL SEO */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Genel SEO</h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Varsayılan Title
                </label>
                <input
                  type="text"
                  value={settings.defaultTitle}
                  onChange={(e) => setSettings({ ...settings, defaultTitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Maksimum 60 karakter önerilir</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Varsayılan Description
                </label>
                <textarea
                  value={settings.defaultDescription}
                  onChange={(e) => setSettings({ ...settings, defaultDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Maksimum 160 karakter önerilir</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Keyword ekle ve Enter'a bas"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.defaultKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={settings.canonicalUrl}
                  onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
                  placeholder="https://woontegra.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* OPEN GRAPH */}
            <div className="space-y-4 mb-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Open Graph (Facebook)</h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  OG Title
                </label>
                <input
                  type="text"
                  value={settings.ogTitle}
                  onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                  placeholder="Boş bırakılırsa varsayılan title kullanılır"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  OG Description
                </label>
                <textarea
                  value={settings.ogDescription}
                  onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                  rows={2}
                  placeholder="Boş bırakılırsa varsayılan description kullanılır"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  OG Image
                </label>
                <div className="flex items-center gap-4">
                  {settings.ogImage && (
                    <img src={settings.ogImage} alt="OG" className="h-20 w-auto rounded-lg border border-gray-200" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer transition-all">
                    <ImageIcon className="w-5 h-5" />
                    OG Image Yükle
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'ogImage')}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Önerilen boyut: 1200x630px</p>
              </div>
            </div>

            {/* TWITTER */}
            <div className="space-y-4 mb-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Twitter Card</h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Twitter Title
                </label>
                <input
                  type="text"
                  value={settings.twitterTitle}
                  onChange={(e) => setSettings({ ...settings, twitterTitle: e.target.value })}
                  placeholder="Boş bırakılırsa varsayılan title kullanılır"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Twitter Description
                </label>
                <textarea
                  value={settings.twitterDescription}
                  onChange={(e) => setSettings({ ...settings, twitterDescription: e.target.value })}
                  rows={2}
                  placeholder="Boş bırakılırsa varsayılan description kullanılır"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Twitter Image
                </label>
                <div className="flex items-center gap-4">
                  {settings.twitterImage && (
                    <img src={settings.twitterImage} alt="Twitter" className="h-20 w-auto rounded-lg border border-gray-200" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer transition-all">
                    <ImageIcon className="w-5 h-5" />
                    Twitter Image Yükle
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'twitterImage')}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Önerilen boyut: 1200x600px</p>
              </div>
            </div>

            {/* INDEX AYARLARI */}
            <div className="space-y-4 mb-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Index Ayarları</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Indexable (Arama motorlarında görünsün)
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Index / Noindex</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, indexable: !settings.indexable })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.indexable ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.indexable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Followable (Linkleri takip etsin)
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Follow / Nofollow</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, followable: !settings.followable })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.followable ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.followable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* SCHEMA */}
            <div className="space-y-4 mb-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Schema.org</h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={settings.organizationName}
                  onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Organization Logo URL
                </label>
                <input
                  type="url"
                  value={settings.organizationLogo}
                  onChange={(e) => setSettings({ ...settings, organizationLogo: e.target.value })}
                  placeholder="https://woontegra.com/logo.png"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Custom Schema JSON-LD
                </label>
                <textarea
                  value={settings.schemaJson}
                  onChange={(e) => setSettings({ ...settings, schemaJson: e.target.value })}
                  rows={4}
                  placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>

            {/* ROBOTS.TXT */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Robots.txt</h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  robots.txt İçeriği
                </label>
                <textarea
                  value={settings.robotsTxt}
                  onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                  rows={6}
                  placeholder="User-agent: *&#10;Disallow: /admin/&#10;Sitemap: https://woontegra.com/sitemap.xml"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* 5. ANALYTICS & TRACKING */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BarChart className="w-6 h-6 text-green-600" />
              Analytics & Tracking
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Google Analytics ID (GA4)
                </label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={settings.googleTagManagerId}
                  onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={settings.facebookPixelId}
                  onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                  placeholder="123456789012345"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  TikTok Pixel ID
                </label>
                <input
                  type="text"
                  value={settings.tiktokPixelId}
                  onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
                  placeholder="XXXXXXXXXXXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hotjar ID
                </label>
                <input
                  type="text"
                  value={settings.hotjarId}
                  onChange={(e) => setSettings({ ...settings, hotjarId: e.target.value })}
                  placeholder="1234567"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Custom Head Script
                </label>
                <textarea
                  value={settings.customHeadScript}
                  onChange={(e) => setSettings({ ...settings, customHeadScript: e.target.value })}
                  rows={4}
                  placeholder="<script>...</script>"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">&lt;head&gt; içine eklenecek</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Custom Footer Script
                </label>
                <textarea
                  value={settings.customFooterScript}
                  onChange={(e) => setSettings({ ...settings, customFooterScript: e.target.value })}
                  rows={4}
                  placeholder="<script>...</script>"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">&lt;/body&gt; öncesine eklenecek</p>
              </div>
            </div>
          </div>

          {/* 6. E-MAIL (SMTP) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-green-600" />
              E-Mail (SMTP)
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Host
                  </label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Port
                  </label>
                  <input
                    type="text"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                    placeholder="587"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    SSL/TLS Secure
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Güvenli bağlantı kullan</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, smtpSecure: !settings.smtpSecure })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.smtpSecure ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.smtpSecure ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <button
                onClick={handleTestEmail}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                <Mail className="w-5 h-5" />
                Test E-postası Gönder
              </button>
            </div>
          </div>

          {/* 7. SİSTEM AYARLARI */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-green-600" />
              Sistem Ayarları
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Bakım Modu
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Site ziyaretçilere kapalı olur</p>
                </div>
                <button
                  onClick={() => {
                    const newMode = !settings.maintenanceMode
                    setSettings({ ...settings, maintenanceMode: newMode })
                    localStorage.setItem('woontegra_maintenance_mode', String(newMode))
                    if (newMode) {
                      localStorage.setItem('woontegra_maintenance_message', settings.maintenanceMessage)
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.maintenanceMode && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bakım Modu Mesajı
                  </label>
                  <textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) => {
                      const newMessage = e.target.value
                      setSettings({ ...settings, maintenanceMessage: newMessage })
                      localStorage.setItem('woontegra_maintenance_message', newMessage)
                    }}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={handleClearCache}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  Cache Temizle
                </button>

                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  Log Temizle
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
