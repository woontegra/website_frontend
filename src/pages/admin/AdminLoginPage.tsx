import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue'

const apiBase = () => import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBase()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!data.success) {
        setErr(data.message ?? 'Giriş başarısız')
        setLoading(false)
        return
      }
      if (data.user?.role !== 'admin') {
        setErr('Bu alan yalnızca yönetici hesapları içindir.')
        setLoading(false)
        return
      }
      localStorage.setItem('woontegra_token', data.token)
      const target =
        from.startsWith('/admin') && from !== '/admin' ? from : '/admin/sayfalar'
      navigate(target, { replace: true })
    } catch {
      setErr('Sunucuya bağlanılamadı. API adresini kontrol edin.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(15,23,42,0.5),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/">
            <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-4">
              <span className="text-2xl font-bold text-white">Woontegra</span>
            </div>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">Yönetim Paneli</h1>
          <p className="mt-2 text-gray-300">Yönetici hesabınızla giriş yapın</p>
        </div>
        <Card className="p-8 md:p-10 shadow-2xl border border-white/10 bg-white/95 backdrop-blur-xl">
          {err && <p className="mb-6 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 font-medium">{err}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-900 mb-2">
                E-posta
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-slate-900 focus:outline-none focus:border-green-500 transition-colors text-lg"
                placeholder="info@woontegra.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-900 mb-2">
                Şifre
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-slate-900 focus:outline-none focus:border-green-500 transition-colors text-lg"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-bold text-lg shadow-lg shadow-green-500/30" 
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            <Link to="/" className="text-slate-900 hover:text-green-600 font-medium transition-colors">
              ← Siteye Dön
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
