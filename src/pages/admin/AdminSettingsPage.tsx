import { useState, useEffect } from 'react'
import { Save, ChevronDown, ChevronUp, Settings, Palette, Mail, Globe, BarChart, Wrench, X, RefreshCw } from 'lucide-react'
import { getApiUrl } from '../../config/api'

interface SiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  darkModeLogo: string
  language: string
  currency: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  borderRadius: string
  buttonStyle: string
  contactEmail: string
  contactPhone: string
  contactWhatsApp: string
  contactAddress: string
  googleMapsEmbed: string
  defaultTitle: string
  defaultDescription: string
  defaultKeywords: string[]
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  indexable: boolean
  followable: boolean
  organizationName: string
  organizationLogo: string
  schemaJson: string
  robotsTxt: string
  googleAnalyticsId: string
  googleTagManagerId: string
  facebookPixelId: string
  tiktokPixelId: string
  hotjarId: string
  customHeadScript: string
  customFooterScript: string
  smtpHost: string
  smtpPort: string
  smtpSecure: boolean
  smtpUser: string
  smtpPassword: string
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
    primaryColor: '#22c55e',
    secondaryColor: '#0ea5e9',
    fontFamily: 'Inter',
    borderRadius: 'lg',
    buttonStyle: 'solid',
    contactEmail: '',
    contactPhone: '',
    contactWhatsApp: '',
    contactAddress: '',
    googleMapsEmbed: '',
    defaultTitle: "Woontegra | Yazılım, Dijital Hizmetler ve Ticaret Tek Yapıda",
    defaultDescription: 'Yazılım geliştirme, SaaS, e-ticaret, marka & patent vekilligi, oyun geliştirme.',
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
    organizationName: '',
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
  const [openSections, setOpenSections] = useState<string[]>(['general'])

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
        setMessage({ type: 'success', text: 'Ayarlar kaydedildi!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Kaydetme hatası' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası' })
    } finally {
      setSaving(false)
    }
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    )
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
          <p className="text-slate-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const Section = ({ id, icon: Icon, title, children }: { id: string, icon: any, title: string, children: React.ReactNode }) => {
    const isOpen = openSections.includes(id)
    return (
      <div className="card">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-green-600" />
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
        {isOpen && (
          <div className="p-4 pt-0 compact-space-y">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Settings className="w-6 h-6 text-green-600" />
            Site Ayarları
          </h1>
          <p className="text-xs text-slate-600 mt-1">Tüm site ayarlarını buradan yönetin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="button flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* GENEL AYARLAR */}
      <Section id="general" icon={Settings} title="Genel Ayarlar">
        <div>
          <label className="label">Site Adı</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="input w-full"
          />
        </div>
        <div>
          <label className="label">Site Açıklaması</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            rows={2}
            className="textarea w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Dil</label>
            <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="input w-full">
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="label">Para Birimi</label>
            <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="input w-full">
              <option value="TRY">₺ (TRY)</option>
              <option value="USD">$ (USD)</option>
              <option value="EUR">€ (EUR)</option>
            </select>
          </div>
        </div>
      </Section>

      {/* MARKA & GÖRSEL */}
      <Section id="brand" icon={Palette} title="Marka & Görsel Ayarlar">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Primary Color</label>
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              className="input w-full h-10"
            />
          </div>
          <div>
            <label className="label">Secondary Color</label>
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
              className="input w-full h-10"
            />
          </div>
        </div>
        <div>
          <label className="label">Font Ailesi</label>
          <select value={settings.fontFamily} onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })} className="input w-full">
            {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Border Radius</label>
            <select value={settings.borderRadius} onChange={(e) => setSettings({ ...settings, borderRadius: e.target.value })} className="input w-full">
              {BORDER_RADIUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Button Style</label>
            <select value={settings.buttonStyle} onChange={(e) => setSettings({ ...settings, buttonStyle: e.target.value })} className="input w-full">
              {BUTTON_STYLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </Section>

      {/* İLETİŞİM BİLGİLERİ */}
      <Section id="contact" icon={Mail} title="İletişim Bilgileri">
        <div>
          <label className="label">E-posta</label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            className="input w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Telefon</label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">WhatsApp</label>
            <input
              type="tel"
              value={settings.contactWhatsApp}
              onChange={(e) => setSettings({ ...settings, contactWhatsApp: e.target.value })}
              className="input w-full"
            />
          </div>
        </div>
        <div>
          <label className="label">Adres</label>
          <textarea
            value={settings.contactAddress}
            onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
            rows={2}
            className="textarea w-full"
          />
        </div>
      </Section>

      {/* SEO AYARLARI */}
      <Section id="seo" icon={Globe} title="SEO Ayarları">
        <div>
          <label className="label">Varsayılan Title</label>
          <input
            type="text"
            value={settings.defaultTitle}
            onChange={(e) => setSettings({ ...settings, defaultTitle: e.target.value })}
            className="input w-full"
          />
        </div>
        <div>
          <label className="label">Varsayılan Description</label>
          <textarea
            value={settings.defaultDescription}
            onChange={(e) => setSettings({ ...settings, defaultDescription: e.target.value })}
            rows={2}
            className="textarea w-full"
          />
        </div>
        <div>
          <label className="label">Keywords</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Keyword ekle ve Enter'a bas"
              className="input flex-1"
            />
            <button onClick={addKeyword} className="button-secondary">Ekle</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.defaultKeywords.map((keyword, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                {keyword}
                <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => removeKeyword(keyword)} />
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Canonical URL</label>
          <input
            type="url"
            value={settings.canonicalUrl}
            onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
            className="input w-full"
          />
        </div>
      </Section>

      {/* OPEN GRAPH */}
      <Section id="og" icon={Globe} title="Open Graph (Facebook)">
        <div>
          <label className="label">OG Title</label>
          <input
            type="text"
            value={settings.ogTitle}
            onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
            className="input w-full"
          />
        </div>
        <div>
          <label className="label">OG Description</label>
          <textarea
            value={settings.ogDescription}
            onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
            rows={2}
            className="textarea w-full"
          />
        </div>
        <div>
          <label className="label">OG Image URL</label>
          <input
            type="url"
            value={settings.ogImage}
            onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
            className="input w-full"
          />
        </div>
      </Section>

      {/* TWITTER CARD */}
      <Section id="twitter" icon={Globe} title="Twitter Card">
        <div>
          <label className="label">Twitter Title</label>
          <input
            type="text"
            value={settings.twitterTitle}
            onChange={(e) => setSettings({ ...settings, twitterTitle: e.target.value })}
            className="input w-full"
          />
        </div>
        <div>
          <label className="label">Twitter Description</label>
          <textarea
            value={settings.twitterDescription}
            onChange={(e) => setSettings({ ...settings, twitterDescription: e.target.value })}
            rows={2}
            className="textarea w-full"
          />
        </div>
        <div>
          <label className="label">Twitter Image URL</label>
          <input
            type="url"
            value={settings.twitterImage}
            onChange={(e) => setSettings({ ...settings, twitterImage: e.target.value })}
            className="input w-full"
          />
        </div>
      </Section>

      {/* ANALİTİK */}
      <Section id="analytics" icon={BarChart} title="Analitik & Tracking">
        <div>
          <label className="label">Google Analytics ID</label>
          <input
            type="text"
            value={settings.googleAnalyticsId}
            onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
            placeholder="G-XXXXXXXXXX"
            className="input w-full"
          />
        </div>
        <div>
          <label className="label">Google Tag Manager ID</label>
          <input
            type="text"
            value={settings.googleTagManagerId}
            onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
            placeholder="GTM-XXXXXXX"
            className="input w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Facebook Pixel ID</label>
            <input
              type="text"
              value={settings.facebookPixelId}
              onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">TikTok Pixel ID</label>
            <input
              type="text"
              value={settings.tiktokPixelId}
              onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
              className="input w-full"
            />
          </div>
        </div>
      </Section>

      {/* SİSTEM AYARLARI */}
      <Section id="system" icon={Wrench} title="Sistem Ayarları">
        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Bakım Modu</label>
            <p className="text-xs text-gray-500 mt-0.5">Site ziyaretçilere kapalı olur</p>
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
            <label className="label">Bakım Modu Mesajı</label>
            <textarea
              value={settings.maintenanceMessage}
              onChange={(e) => {
                const newMessage = e.target.value
                setSettings({ ...settings, maintenanceMessage: newMessage })
                localStorage.setItem('woontegra_maintenance_message', newMessage)
              }}
              rows={2}
              className="textarea w-full"
            />
          </div>
        )}

        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={handleClearCache}
            className="button-outline w-full flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Cache Temizle
          </button>
        </div>
      </Section>
    </div>
  )
}
