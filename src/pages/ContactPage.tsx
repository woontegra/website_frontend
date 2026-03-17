import { useState } from 'react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue'

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="İletişim"
          subtitle="Sorularınız veya proje talepleriniz için bize ulaşın."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8">
              {sent ? (
                <p className="text-accent-green font-medium">Mesajınız alındı. En kısa sürede dönüş yapacağız.</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-heading mb-1">Ad Soyad</label>
                    <input id="name" name="name" type="text" required className={inputClass} placeholder="Adınız Soyadınız" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-heading mb-1">E-posta</label>
                    <input id="email" name="email" type="email" required className={inputClass} placeholder="ornek@email.com" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-heading mb-1">Mesaj</label>
                    <textarea id="message" name="message" rows={5} required className={`${inputClass} resize-none`} placeholder="Mesajınız..." />
                  </div>
                  <Button type="submit">Gönder</Button>
                </form>
              )}
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-heading mb-2">WhatsApp</h3>
              <a href="https://wa.me/90XXXXXXXXXX" className="text-accent-blue hover:underline" target="_blank" rel="noopener noreferrer">
                +90 XXX XXX XX XX
              </a>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-heading mb-2">E-posta</h3>
              <a href="mailto:info@woontegra.com" className="text-accent-blue hover:underline">info@woontegra.com</a>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-heading mb-2">Telefon</h3>
              <a href="tel:+90XXXXXXXXXX" className="text-accent-blue hover:underline">+90 XXX XXX XX XX</a>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-heading mb-2">Adres</h3>
              <p className="text-surface-600 text-sm">Örnek Mah. Örnek Sok. No: X, İstanbul</p>
            </Card>
            <div className="h-48 rounded-xl bg-surface-100 flex items-center justify-center text-surface-500 text-sm">
              Harita alanı
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
