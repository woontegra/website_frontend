import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { servicesApi } from '../../api/services'
import { brandsApi } from '../../api/brands'
import { contactMessagesApi } from '../../api/contact-messages'
import { FileText, Package, Mail, Image } from 'lucide-react'

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    services: 0,
    brands: 0,
    messages: 0,
    unreadMessages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [services, brands, messages] = await Promise.all([
        servicesApi.getAll(),
        brandsApi.getAll(),
        contactMessagesApi.getAll(),
      ])

      setStats({
        services: services.length,
        brands: brands.length,
        messages: messages.length,
        unreadMessages: messages.filter(m => !m.read).length,
      })
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      label: 'Hizmetler', 
      value: stats.services, 
      icon: Package, 
      to: '/admin/hizmetler',
      color: 'text-blue-500'
    },
    { 
      label: 'Markalar', 
      value: stats.brands, 
      icon: Image, 
      to: '/admin/markalar',
      color: 'text-purple-500'
    },
    { 
      label: 'Mesajlar', 
      value: stats.messages, 
      icon: Mail, 
      to: '/admin/mesajlar',
      color: 'text-green-500',
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} okunmamış` : undefined
    },
  ]

  const cmsLinks = [
    { to: '/admin/sayfalar', label: 'Sayfalar', desc: 'Statik sayfalar ve içerik', icon: FileText },
    { to: '/admin/yazilar', label: 'Yazılar', desc: 'Blog yazıları', icon: FileText },
    { to: '/admin/kategoriler', label: 'Kategoriler', desc: 'Yazı kategorileri', icon: FileText },
    { to: '/admin/menuler', label: 'Menüler', desc: 'Üst ve alt menü', icon: FileText },
    { to: '/admin/medya', label: 'Medya', desc: 'Dosya ve görseller', icon: Image },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Genel Bakış</h1>
        <p className="text-gray-600">Woontegra CMS yönetim paneline hoş geldiniz</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.to} to={stat.to}>
              <Card className="p-8 h-full bg-white hover:shadow-2xl hover:scale-105 transition-all border border-gray-200 hover:border-green-500/50 group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-4xl font-bold text-slate-900 mb-2">
                      {loading ? '...' : stat.value}
                    </p>
                    {stat.badge && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-semibold">
                        {stat.badge}
                      </span>
                    )}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">İçerik Yönetimi</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cmsLinks.map((item) => (
            <Link key={item.to} to={item.to}>
              <Card className="p-6 h-full bg-white hover:shadow-xl hover:border-green-500/50 transition-all border border-gray-200 group">
                <p className="font-bold text-slate-900 text-lg mb-2 group-hover:text-green-600 transition-colors">{item.label}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
