import { Link, useNavigate } from 'react-router-dom'
import { LayoutGrid, Heart, MapPin, Package, UserRound, LogOut, Cloud } from 'lucide-react'
import { getCustomerProfile } from '../lib/customerAuth'
import { customersApi } from '../api/customers-api'

const cards = [
  { to: '/hesabim/siparisler', label: 'Siparişlerim', desc: 'Sipariş geçmişiniz ve durumlar', icon: Package },
  { to: '/hesabim/uyelikler', label: 'Üyeliklerim', desc: 'SaaS lisans ve abonelik bilgileri', icon: Cloud },
  { to: '/hesabim/adresler', label: 'Adreslerim', desc: 'Teslimat ve fatura adresleri', icon: MapPin },
  { to: '/hesabim/hesap-detaylari', label: 'Hesap bilgilerim', desc: 'Profil ve şifre güvenliği', icon: UserRound },
  { to: '/hesabim/favoriler', label: 'Favorilerim', desc: 'Kaydettiğiniz ürünler', icon: Heart },
] as const

const cardInner =
  'flex h-full min-h-[9.75rem] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md'

export function HesabimDashboardPage() {
  const p = getCustomerProfile()
  const navigate = useNavigate()

  const onLogout = () => {
    customersApi.logoutLocal()
    navigate('/giris', { replace: true })
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-6 shadow-sm sm:p-7">
        <div className="flex items-start gap-3">
          <LayoutGrid className="h-8 w-8 shrink-0 text-emerald-600" aria-hidden />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pano{p?.name ? ` — ${p.name}` : ''}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Siparişlerinizi takip edin, adreslerinizi yönetin ve hesap bilgilerinizi güvenle güncelleyin.
            </p>
          </div>
        </div>
      </div>

      <ul className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <li key={c.to} className="flex min-h-0">
              <Link to={c.to} className={`${cardInner} w-full`}>
                <Icon className="h-6 w-6 shrink-0 text-emerald-600" aria-hidden />
                <span className="mt-3 block font-semibold text-slate-900">{c.label}</span>
                <span className="mt-1 block flex-1 text-sm leading-snug text-slate-600">{c.desc}</span>
              </Link>
            </li>
          )
        })}
        <li className="flex min-h-0">
          <button type="button" onClick={onLogout} className={`${cardInner} w-full text-left`}>
            <LogOut className="h-6 w-6 shrink-0 text-red-600" aria-hidden />
            <span className="mt-3 block font-semibold text-slate-900">Çıkış</span>
            <span className="mt-1 block flex-1 text-sm leading-snug text-slate-600">Oturumu güvenle kapat</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
