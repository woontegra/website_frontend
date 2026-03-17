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
      navigate(from.startsWith('/admin') ? from : '/admin', { replace: true })
    } catch {
      setErr('Sunucuya bağlanılamadı. API adresini kontrol edin.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="Woontegra" className="h-12 mx-auto" />
          </Link>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Yönetim paneli</h1>
          <p className="mt-1 text-sm text-slate-600">Yönetici hesabınızla giriş yapın</p>
        </div>
        <Card className="p-6 md:p-8 shadow-lg border border-gray-200">
          {err && <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 mb-1">
                E-posta
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
                placeholder="info@woontegra.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 mb-1">
                Şifre
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Giriş…' : 'Giriş yap'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/" className="text-accent-blue hover:underline">
              ← Siteye dön
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
