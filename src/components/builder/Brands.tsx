import { useNode } from '@craftjs/core'
import { BrandsSettings } from './settings/BrandsSettings'

export interface BrandsProps {
  title?: string
  subtitle?: string
  brands?: Array<{ name: string; image: string; description: string }>
}

export const Brands = ({
  title = 'Çözümlerimiz',
  subtitle = 'Farklı sektörlere özel geliştirdiğimiz platformlar',
  brands = [
    {
      name: 'Bilirkişi Hesaplama',
      image: '/images/brand-bilirkisi.jpg',
      description: 'Aktüerya ve bilirkişi hesaplama platformu',
    },
    {
      name: 'Optimoon',
      image: '/images/brand-optimoon.jpg',
      description: 'Dijital pazarlama ve SEO optimizasyon',
    },
    {
      name: 'Datça Tropikal',
      image: '/images/brand-datca.jpg',
      description: 'Turizm ve konaklama rezervasyon sistemi',
    },
  ],
}: BrandsProps) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref))
      }}
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{brand.name}</h3>
                <p className="text-gray-600">{brand.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

Brands.craft = {
  displayName: 'Brands',
  props: {
    title: 'Çözümlerimiz',
    subtitle: 'Farklı sektörlere özel geliştirdiğimiz platformlar',
    brands: [
      {
        name: 'Bilirkişi Hesaplama',
        image: '/images/brand-bilirkisi.jpg',
        description: 'Aktüerya ve bilirkişi hesaplama platformu',
      },
      {
        name: 'Optimoon',
        image: '/images/brand-optimoon.jpg',
        description: 'Dijital pazarlama ve SEO optimizasyon',
      },
      {
        name: 'Datça Tropikal',
        image: '/images/brand-datca.jpg',
        description: 'Turizm ve konaklama rezervasyon sistemi',
      },
    ],
  },
  related: {
    settings: BrandsSettings,
  },
}
