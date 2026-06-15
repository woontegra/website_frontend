import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export function SiparisSorgulaPage() {
  const navigate = useNavigate()
  const [orderNo, setOrderNo] = useState('')
  const [email, setEmail] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const o = orderNo.trim()
    const em = email.trim()
    if (!o || !em) return
    navigate(`/siparislerim?orderNo=${encodeURIComponent(o)}&customerEmail=${encodeURIComponent(em)}`)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <Search className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Misafir sipariş sorgulama</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Üye olmadan verdiğiniz siparişi sipariş numarası ve siparişte kullandığınız e-posta ile görüntüleyin.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">E-posta</label>
            <input
              required
              type="email"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Sipariş numarası</label>
            <input
              required
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="WNT-…"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full rounded-xl bg-sky-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700">
            Misafir sipariş sorgula
          </button>
        </form>
      </div>

      <p className="mt-10 text-center text-sm text-slate-600">
        <Link to="/giris" className="font-semibold text-emerald-700 hover:underline">
          Üye girişi
        </Link>
        <span className="mx-2 text-slate-300">·</span>
        <Link to="/hesabim" className="font-semibold text-emerald-700 hover:underline">
          Hesabım
        </Link>
      </p>
    </div>
  )
}
