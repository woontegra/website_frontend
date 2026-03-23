import { ContactForm } from '../components/forms/ContactForm'
import { Mail, Phone, MapPin } from 'lucide-react'

export function ContactPage() {
  const email = localStorage.getItem('contact_email') || 'info@woontegra.com'
  const phone = localStorage.getItem('contact_phone') || '0532 317 17 55'
  const address = localStorage.getItem('contact_address') || 'İskele Mahallesi Bademli Caddesi 43/6 Datça-Muğla'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">İletişim</h1>
          <p className="text-lg text-gray-600">
            Projeleriniz için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">E-posta</h3>
            <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
              {email}
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-green-600 hover:underline">
              {phone}
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Adres</h3>
            <p className="text-gray-600">{address}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mesaj Gönderin</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
