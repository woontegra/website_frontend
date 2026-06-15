import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Search } from 'lucide-react'
import { customersApi } from '../api/customers-api'
import { getCustomerProfile } from '../lib/customerAuth'

const shell = 'mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `no-underline select-none flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold outline-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/35 focus-visible:ring-offset-0 lg:w-full ${
    isActive
      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-1 ring-emerald-500/30'
      : 'border border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
  }`

export function HesabimLayout() {
  const navigate = useNavigate()
  const profile = getCustomerProfile()

  const onLogout = () => {
    customersApi.logoutLocal()
    navigate('/giris', { replace: true })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50/90 via-white to-slate-50/80">
      <div className={`${shell} py-8 sm:py-10`}>
        <header className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700/90">Müşteri paneli</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Hesabım</h1>
              {profile ? (
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">{profile.name}</span>
                  <span className="hidden text-slate-300 sm:inline" aria-hidden>
                    ·
                  </span>
                  <span className="truncate text-slate-600">{profile.email}</span>
                </div>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to="/urunler"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Alışverişe devam
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:mt-10 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10">
          <aside className="min-w-0 lg:sticky lg:top-24">
            <nav
              className="flex select-none gap-2 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white p-2 shadow-sm [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible lg:p-2.5 [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block"
              aria-label="Hesap menüsü"
            >
              <NavLink to="/hesabim" end className={navLinkClass}>
                Pano
              </NavLink>
              <NavLink to="/hesabim/siparisler" className={navLinkClass}>
                Siparişlerim
              </NavLink>
              <NavLink to="/hesabim/adresler" className={navLinkClass}>
                Adreslerim
              </NavLink>
              <NavLink to="/hesabim/hesap-detaylari" className={navLinkClass}>
                Hesap Bilgilerim
              </NavLink>
              <NavLink to="/hesabim/favoriler" className={navLinkClass}>
                Favorilerim
              </NavLink>
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full shrink-0 items-center gap-2 rounded-xl border border-transparent px-3.5 py-2.5 text-left text-sm font-semibold text-red-700 outline-none transition hover:border-red-100 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-400/40 focus-visible:ring-offset-0"
              >
                <LogOut className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                Çıkış
              </button>
            </nav>

            <div className="mt-5 rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
              <p className="text-sm font-semibold leading-snug text-slate-900">Üye olmadan verdiğiniz siparişi sorgulayın</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Sipariş numaranızı ve siparişte kullandığınız e-postayı girerek durumu görüntüleyebilirsiniz.
              </p>
              <Link
                to="/siparis-sorgula"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
              >
                <Search className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
                Misafir sipariş sorgula
              </Link>
            </div>
          </aside>

          <main className="min-w-0 w-full rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
