import { useState, useEffect } from 'react'
import { brandsApi, type Brand } from '../../api/brands'
import { SectionHeader } from '../ui/SectionHeader'

export function DynamicBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      const data = await brandsApi.getAll()
      setBrands(data)
    } catch (error) {
      console.error('Markalar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-gray-50 py-24 md:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="İş Ortaklarımız"
            subtitle="Yükleniyor..."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg h-32" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (brands.length === 0) {
    return null
  }

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Çözümlerimiz
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Farklı sektörlere özel geliştirdiğimiz platformlar
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {brands.map((brand) => {
            const BrandContent = (
              <div className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="br" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230f172a"/%3E%3Cstop offset="100%25" style="stop-color:%2322c55e"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23br)" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23fff" font-family="sans-serif" font-size="20" font-weight="600"%3E' + brand.name + '%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{brand.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{brand.description || 'Özel çözüm platformu'}</p>
                </div>
              </div>
            )

            return brand.url ? (
              <a
                key={brand.id}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                title={brand.name}
              >
                {BrandContent}
              </a>
            ) : (
              <div key={brand.id}>{BrandContent}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
