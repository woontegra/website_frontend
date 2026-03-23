import { useNode } from '@craftjs/core'
import { ContactSettings } from './settings/ContactSettings'
import { Mail, Phone, MapPin } from 'lucide-react'

export interface ContactProps {
  title?: string
  subtitle?: string
  email?: string
  phone?: string
  address?: string
}

export const Contact = ({
  title = 'İletişim',
  subtitle = 'Bizimle iletişime geçin',
  email = 'info@woontegra.com',
  phone = '+90 555 123 45 67',
  address = 'İstanbul, Türkiye',
}: ContactProps) => {
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
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">E-posta</h3>
            <p className="text-gray-600">{email}</p>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Telefon</h3>
            <p className="text-gray-600">{phone}</p>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Adres</h3>
            <p className="text-gray-600">{address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

Contact.craft = {
  displayName: 'Contact',
  props: {
    title: 'İletişim',
    subtitle: 'Bizimle iletişime geçin',
    email: 'info@woontegra.com',
    phone: '+90 555 123 45 67',
    address: 'İstanbul, Türkiye',
  },
  related: {
    settings: ContactSettings,
  },
}
