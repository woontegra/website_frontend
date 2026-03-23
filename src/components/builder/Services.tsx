import { useNode } from '@craftjs/core'
import { ServicesSettings } from './settings/ServicesSettings'
import { Code, Smartphone, Globe } from 'lucide-react'

export interface ServicesProps {
  title?: string
  subtitle?: string
  services?: Array<{ icon: string; title: string; description: string }>
}

const iconMap: Record<string, any> = {
  Code,
  Smartphone,
  Globe,
}

export const Services = ({
  title = 'Hizmetlerimiz',
  subtitle = 'Yazılımdan danışmanlığa, geniş bir hizmet yelpazesi',
  services = [
    { icon: 'Code', title: 'Web Geliştirme', description: 'Modern web uygulamaları' },
    { icon: 'Smartphone', title: 'Mobil Uygulama', description: 'iOS ve Android uygulamalar' },
    { icon: 'Globe', title: 'Dijital Pazarlama', description: 'SEO ve sosyal medya' },
  ],
}: ServicesProps) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref))
      }}
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-green-400 mb-6">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

Services.craft = {
  displayName: 'Services',
  props: {
    title: 'Hizmetlerimiz',
    subtitle: 'Yazılımdan danışmanlığa, geniş bir hizmet yelpazesi',
    services: [
      { icon: 'Code', title: 'Web Geliştirme', description: 'Modern web uygulamaları' },
      { icon: 'Smartphone', title: 'Mobil Uygulama', description: 'iOS ve Android uygulamalar' },
      { icon: 'Globe', title: 'Dijital Pazarlama', description: 'SEO ve sosyal medya' },
    ],
  },
  related: {
    settings: ServicesSettings,
  },
}
