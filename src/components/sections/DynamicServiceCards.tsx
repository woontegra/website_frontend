import { useState, useEffect } from 'react'
import { servicesApi, type Service } from '../../api/services'
import { SectionHeader } from '../ui/SectionHeader'
import { Code, Smartphone, ShoppingCart, Cloud, Lightbulb, Shield, Package } from 'lucide-react'

const iconMap: Record<string, any> = {
  Code,
  Smartphone,
  ShoppingCart,
  Cloud,
  Lightbulb,
  Shield,
  Package,
}

export function DynamicServiceCards() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      console.log('🔄 Loading services...')
      const data = await servicesApi.getAll()
      console.log('✅ Services loaded:', data)
      setServices(data.slice(0, 4))
    } catch (error) {
      console.error('❌ Hizmetler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="animate-fade-up bg-white py-24 md:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Hizmetlerimiz"
            subtitle="Yükleniyor..."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-64" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Hizmetlerimiz
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            İşletmeniz için profesyonel yazılım çözümleri
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Package
            return (
              <div
                key={service.id}
                className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-green-100 rounded-lg mb-6">
                  <Icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
