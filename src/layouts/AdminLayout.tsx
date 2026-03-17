import { Link, Outlet, useLocation } from 'react-router-dom'

const adminNav = [
  { label: 'Genel Bakış', href: '/admin' },
  { label: 'CMS — Sayfalar', href: '/admin/cms' },
  { label: 'Müşteriler', href: '/admin/musteriler' },
  { label: 'Teklifler', href: '/admin/teklifler' },
  { label: 'Projeler', href: '/admin/projeler' },
  { label: 'İçerik Yönetimi', href: '/admin/icerikler' },
  { label: 'Blog Yönetimi', href: '/admin/blog' },
  { label: 'İletişim Formları', href: '/admin/iletisim-formlari' },
  { label: 'Mail Bildirimleri', href: '/admin/mail-bildirimleri' },
  { label: 'Ayarlar', href: '/admin/ayarlar' },
]

export function AdminLayout() {
  const location = useLocation()
  const isActive = (href: string) => location.pathname === href

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <Link to="/admin" className="font-bold text-heading">Woontegra Admin</Link>
        </div>
        <nav className="p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.href) ? 'bg-accent-blue-soft text-accent-blue' : 'text-surface-600 hover:text-heading hover:bg-surface-50'}`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/" className="block px-4 py-3 rounded-lg text-sm text-surface-600 hover:text-heading">← Siteye dön</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
