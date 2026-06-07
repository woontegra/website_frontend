import { useState, useEffect } from 'react'
import { Save, Settings, Palette, Mail, Globe, BarChart, Wrench, X, RefreshCw, Lock } from 'lucide-react'
import { buildApiUrl } from '../../config/api'
import { ManagedImageField } from '../../components/admin/ManagedImageField'
import { SiteAssetField } from '../../components/admin/SiteAssetField'
import { DEFAULT_SITE_FAVICON, DEFAULT_SITE_LOGO } from '../../api/siteSettings'
import { SettingsCollapsibleSection } from '../../components/admin/SettingsCollapsibleSection'

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
  googleAdsConversionId: string
  googleAdsConversionLabel: string
  metaPixelId: string
  metaTestEventCode: string
  metaBrowserPixelEnabled: boolean
  metaConversionsApiEnabled: boolean
  metaConversionsAccessTokenConfigured?: boolean
  metaConversionsAccessTokenPreview?: string
  facebookPixelId: string
  tiktokPixelId: string
  tiktokPixelEnabled: boolean
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
    logo: DEFAULT_SITE_LOGO,
    favicon: DEFAULT_SITE_FAVICON,
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
    googleAdsConversionId: '',
    googleAdsConversionLabel: '',
    metaPixelId: '',
    metaTestEventCode: '',
    metaBrowserPixelEnabled: true,
    metaConversionsApiEnabled: false,
    facebookPixelId: '',
    tiktokPixelId: '',
    tiktokPixelEnabled: true,
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
  const [openSections, setOpenSections] = useState<string[]>(['account', 'general', 'brand'])
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [metaAccessTokenInput, setMetaAccessTokenInput] = useState('')
  const [clearMetaAccessToken, setClearMetaAccessToken] = useState(false)
  const [metaTokenStatus, setMetaTokenStatus] = useState({
    configured: false,
    preview: '',
  })

  const applySettingsFromApi = (data: Record<string, unknown>) => {
    setSettings((prev) => ({
      ...prev,
      ...(data as unknown as SiteSettings),
      metaPixelId:
        (data.metaPixelId as string) || (data.facebookPixelId as string) || prev.metaPixelId,
    }))
    setMetaTokenStatus({
      configured: Boolean(data.metaConversionsAccessTokenConfigured),
      preview: String(data.metaConversionsAccessTokenPreview ?? ''),
    })
    setMetaAccessTokenInput('')
    setClearMetaAccessToken(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch(buildApiUrl('/settings/admin'), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        applySettingsFromApi(data)
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
      const payload: Record<string, unknown> = {
        ...settings,
        metaPixelId: settings.metaPixelId,
        facebookPixelId: settings.metaPixelId,
      }

      delete payload.metaConversionsAccessToken
      delete payload.metaConversionsAccessTokenConfigured
      delete payload.metaConversionsAccessTokenPreview
      delete payload.smtpPassword
      delete payload.smtpPasswordConfigured
      delete payload.smtpPasswordPreview

      if (clearMetaAccessToken) {
        payload.clearMetaConversionsAccessToken = true
      } else if (metaAccessTokenInput.trim()) {
        payload.metaConversionsAccessToken = metaAccessTokenInput.trim()
      }

      const response = await fetch(buildApiUrl('/settings'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        applySettingsFromApi(data)
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Yeni şifre en az 8 karakter olmalıdır.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' })
      return
    }

    setPasswordSaving(true)
    try {
      const response = await fetch(buildApiUrl('/auth/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        setPasswordMessage({ type: 'error', text: data.message ?? 'Şifre güncellenemedi' })
        return
      }
      setPasswordMessage({ type: 'success', text: 'Şifreniz güncellendi.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setPasswordMessage({ type: 'error', text: 'Bağlantı hatası' })
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleClearCache = async () => {
    try {
      const response = await fetch(buildApiUrl('/settings/clear-cache'), {
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
          type="button"
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

      {/* HESAP */}
      <SettingsCollapsibleSection
        id="account"
        icon={Lock}
        title="Hesap Güvenliği"
        isOpen={openSections.includes('account')}
        onToggle={toggleSection}
      >
        <form onSubmit={handleChangePassword} className="space-y-3">
          {passwordMessage && (
            <div
              className={`rounded-lg p-3 text-sm ${
                passwordMessage.type === 'success'
                  ? 'border border-green-200 bg-green-50 text-green-800'
                  : 'border border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {passwordMessage.text}
            </div>
          )}
          <div>
            <label className="label">Mevcut Şifre</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input w-full"
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <label className="label">Yeni Şifre</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input w-full"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="label">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input w-full"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <button type="submit" disabled={passwordSaving} className="button">
            {passwordSaving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
        </form>
      </SettingsCollapsibleSection>

      {/* GENEL AYARLAR */}
      <SettingsCollapsibleSection
        id="general"
        icon={Settings}
        title="Genel Ayarlar"
        isOpen={openSections.includes('general')}
        onToggle={toggleSection}
      >
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
      </SettingsCollapsibleSection>

      {/* MARKA & GÖRSEL */}
      <SettingsCollapsibleSection
        id="brand"
        icon={Palette}
        title="Marka & Görsel Ayarlar"
        isOpen={openSections.includes('brand')}
        onToggle={toggleSection}
      >
        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Logo & Favicon</h3>
            <p className="mt-1 text-xs text-slate-500">
              <strong>PC’den Yükle</strong> ile dosyayı doğrudan kaydedin veya galeriden mevcut görseli seçin.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SiteAssetField
              label="Site Logosu"
              kind="logo"
              value={settings.logo}
              onChange={(url) => setSettings({ ...settings, logo: url })}
              hint="Navbar ve footer’da görünür."
            />
            <SiteAssetField
              label="Favicon"
              kind="favicon"
              value={settings.favicon}
              onChange={(url) => setSettings({ ...settings, favicon: url })}
              hint="Tarayıcı sekmesi ikonu."
            />
          </div>
        </div>

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
      </SettingsCollapsibleSection>

      {/* İLETİŞİM BİLGİLERİ */}
      <SettingsCollapsibleSection
        id="contact"
        icon={Mail}
        title="İletişim Bilgileri"
        isOpen={openSections.includes('contact')}
        onToggle={toggleSection}
      >
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
      </SettingsCollapsibleSection>

      {/* SEO AYARLARI */}
      <SettingsCollapsibleSection
        id="seo"
        icon={Globe}
        title="SEO Ayarları"
        isOpen={openSections.includes('seo')}
        onToggle={toggleSection}
      >
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addKeyword()
                }
              }}
              placeholder="Keyword ekle ve Enter'a bas"
              className="input flex-1"
            />
            <button type="button" onClick={addKeyword} className="button-secondary">Ekle</button>
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
      </SettingsCollapsibleSection>

      {/* OPEN GRAPH */}
      <SettingsCollapsibleSection
        id="og"
        icon={Globe}
        title="Open Graph (Facebook)"
        isOpen={openSections.includes('og')}
        onToggle={toggleSection}
      >
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
        <ManagedImageField
          label="OG Image"
          value={settings.ogImage}
          onChange={(url) => setSettings({ ...settings, ogImage: url })}
        />
      </SettingsCollapsibleSection>

      {/* TWITTER CARD */}
      <SettingsCollapsibleSection
        id="twitter"
        icon={Globe}
        title="Twitter Card"
        isOpen={openSections.includes('twitter')}
        onToggle={toggleSection}
      >
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
        <ManagedImageField
          label="Twitter Image"
          value={settings.twitterImage}
          onChange={(url) => setSettings({ ...settings, twitterImage: url })}
        />
      </SettingsCollapsibleSection>

      {/* ANALİTİK */}
      <SettingsCollapsibleSection
        id="analytics"
        icon={BarChart}
        title="Analitik & Tracking"
        isOpen={openSections.includes('analytics')}
        onToggle={toggleSection}
      >
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Google</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="label">Google Analytics Measurement ID</label>
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
              <div>
                <label className="label">Google Ads Conversion ID</label>
                <input
                  type="text"
                  value={settings.googleAdsConversionId}
                  onChange={(e) => setSettings({ ...settings, googleAdsConversionId: e.target.value })}
                  placeholder="AW-XXXXXXXXX"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="label">Google Ads Conversion Label</label>
                <input
                  type="text"
                  value={settings.googleAdsConversionLabel}
                  onChange={(e) => setSettings({ ...settings, googleAdsConversionLabel: e.target.value })}
                  placeholder="AbCdEfGhIjKlMnOpQr"
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Meta / Facebook</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="label">Meta Pixel ID</label>
                <input
                  type="text"
                  value={settings.metaPixelId}
                  onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                  placeholder="123456789012345"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="label">Meta Test Event Code</label>
                <input
                  type="text"
                  value={settings.metaTestEventCode}
                  onChange={(e) => setSettings({ ...settings, metaTestEventCode: e.target.value })}
                  placeholder="TEST12345"
                  className="input w-full"
                />
                <p className="mt-1 text-xs text-slate-500">Events Manager test modu için kullanılır.</p>
              </div>
            </div>

            <div>
              <label className="label">Meta Conversions API Access Token</label>
              {metaTokenStatus.configured && !clearMetaAccessToken && (
                <p className="mb-2 text-xs font-medium text-emerald-700">
                  Token kayıtlı
                  {metaTokenStatus.preview ? ` (${metaTokenStatus.preview})` : ''}
                </p>
              )}
              {clearMetaAccessToken && (
                <p className="mb-2 text-xs font-medium text-amber-700">
                  Kayıt sonrası token silinecek.
                </p>
              )}
              <textarea
                value={metaAccessTokenInput}
                onChange={(e) => {
                  setMetaAccessTokenInput(e.target.value)
                  setClearMetaAccessToken(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.preventDefault()
                }}
                onPaste={(e) => e.stopPropagation()}
                placeholder={
                  metaTokenStatus.configured
                    ? 'Yeni token girerek güncelleyin'
                    : 'EAAxxxxxxxx...'
                }
                autoComplete="off"
                spellCheck={false}
                rows={3}
                className="input w-full resize-y font-mono text-sm leading-relaxed"
              />
              <p className="mt-1 text-xs text-slate-500">
                Bu token yalnızca sunucu tarafında kullanılır. Güvenlik nedeniyle kaydedildikten sonra tam değer görüntülenmez.
              </p>
              {metaTokenStatus.configured && (
                <button
                  type="button"
                  onClick={() => {
                    setClearMetaAccessToken(true)
                    setMetaAccessTokenInput('')
                  }}
                  className="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Tokenı temizle
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                <span className="text-sm font-medium text-slate-700">Meta Browser Pixel</span>
                <input
                  type="checkbox"
                  checked={settings.metaBrowserPixelEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, metaBrowserPixelEnabled: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                <span className="text-sm font-medium text-slate-700">Meta Conversions API</span>
                <input
                  type="checkbox"
                  checked={settings.metaConversionsApiEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, metaConversionsApiEnabled: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">TikTok</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="label">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={settings.tiktokPixelId}
                  onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
                  placeholder="CXXXXXXXXXXXXXXX"
                  className="input w-full"
                />
              </div>
              <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 self-end">
                <span className="text-sm font-medium text-slate-700">TikTok Pixel Aktif</span>
                <input
                  type="checkbox"
                  checked={settings.tiktokPixelEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, tiktokPixelEnabled: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
              </label>
            </div>
          </div>
        </div>
      </SettingsCollapsibleSection>

      {/* SİSTEM AYARLARI */}
      <SettingsCollapsibleSection
        id="system"
        icon={Wrench}
        title="Sistem Ayarları"
        isOpen={openSections.includes('system')}
        onToggle={toggleSection}
      >
        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Bakım Modu</label>
            <p className="text-xs text-gray-500 mt-0.5">Site ziyaretçilere kapalı olur</p>
          </div>
          <button
            type="button"
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
            type="button"
            onClick={handleClearCache}
            className="button-outline w-full flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Cache Temizle
          </button>
        </div>
      </SettingsCollapsibleSection>
    </div>
  )
}
