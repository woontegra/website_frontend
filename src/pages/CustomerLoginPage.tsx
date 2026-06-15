import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { customersApi } from '../api/customers-api'

export function CustomerLoginPage() {
  const [params] = useSearchParams()
  const ret = params.get('return') || '/hesabim'
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await customersApi.login(email, password)
      navigate(ret.startsWith('/') ? ret : '/hesabim', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş yapılamadı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">Giriş yap</h1>
      <p className="mt-2 text-sm text-slate-600">
        Hesabınız yok mu?{' '}
        <Link to="/kayit" className="font-semibold text-accent-blue hover:underline">
          Üye olun
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-slate-700">E-posta</label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Şifre</label>
          <input
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? 'Giriş…' : 'Giriş yap'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        <Link to="/siparis-sorgula" className="text-accent-blue hover:underline">
          Misafir sipariş sorgula
        </Link>
      </p>
    </div>
  )
}
