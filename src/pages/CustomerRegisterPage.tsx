import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { customersApi } from '../api/customers-api'

export function CustomerRegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await customersApi.register({ name, email, password, phone: phone.trim() || undefined })
      navigate('/hesabim', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">Üye ol</h1>
      <p className="mt-2 text-sm text-slate-600">
        Zaten üye misiniz?{' '}
        <Link to="/giris" className="font-semibold text-accent-blue hover:underline">
          Giriş yapın
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-slate-700">Ad soyad</label>
          <input required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">E-posta</label>
          <input type="email" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Telefon (isteğe bağlı)</label>
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Şifre (en az 8 karakter)</label>
          <input type="password" required minLength={8} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
          {loading ? 'Kayıt…' : 'Kayıt ol'}
        </button>
      </form>
    </div>
  )
}
