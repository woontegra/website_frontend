import { useState, useEffect } from 'react'

export function AdminSettingsPage() {
  const [email, setEmail] = useState('info@woontegra.com')
  const [phone, setPhone] = useState('+90 555 123 45 67')
  const [address, setAddress] = useState('İstanbul, Türkiye')
  const [msg, setMsg] = useState('')

  const handleSave = () => {
    // LocalStorage'a kaydet (geçici çözüm)
    localStorage.setItem('contact_email', email)
    localStorage.setItem('contact_phone', phone)
    localStorage.setItem('contact_address', address)
    setMsg('Kaydedildi ✓')
    setTimeout(() => setMsg(''), 3000)
  }

  useEffect(() => {
    // LocalStorage'dan yükle
    const savedEmail = localStorage.getItem('contact_email')
    const savedPhone = localStorage.getItem('contact_phone')
    const savedAddress = localStorage.getItem('contact_address')
    
    if (savedEmail) setEmail(savedEmail)
    if (savedPhone) setPhone(savedPhone)
    if (savedAddress) setAddress(savedAddress)
  }, [])

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Site Ayarları</h1>
      
      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {msg}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">İletişim Bilgileri</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Adres
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
