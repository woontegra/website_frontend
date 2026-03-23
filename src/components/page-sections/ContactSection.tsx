import { useState } from 'react'

type ContactContent = {
  title?: string
  subtitle?: string
  phone?: string
  email?: string
  whatsapp?: string
  address?: string
  showForm?: boolean
  showMap?: boolean
  mapEmbedUrl?: string
  phoneLabel?: string
  emailLabel?: string
  whatsappLabel?: string
  addressLabel?: string
  nameLabel?: string
  messageLabel?: string
  submitLabel?: string
  successMessage?: string
  namePlaceholder?: string
  emailPlaceholder?: string
  messagePlaceholder?: string
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue'

export default function ContactSection(p: ContactContent) {
  const title = String(p.title ?? 'İletişim')
  const subtitle = String(p.subtitle ?? 'Sorularınız için bize ulaşın.')
  const phone = String(p.phone ?? '')
  const email = String(p.email ?? '')
  const whatsapp = String(p.whatsapp ?? '')
  const address = String(p.address ?? '')
  const showForm = p.showForm !== false
  const showMap = p.showMap !== false
  const mapEmbedUrl = String(p.mapEmbedUrl ?? '').trim()
  const phoneLabel = String(p.phoneLabel || 'Telefon')
  const emailLabel = String(p.emailLabel || 'E-posta')
  const whatsappLabel = String(p.whatsappLabel || 'WhatsApp')
  const addressLabel = String(p.addressLabel || 'Adres')
  const nameLabel = String(p.nameLabel || 'Ad Soyad')
  const messageLabel = String(p.messageLabel || 'Mesaj')
  const submitLabel = String(p.submitLabel || 'Gönder')
  const successMessage = String(p.successMessage || 'Mesajınız alındı. En kısa sürede dönüş yapacağız.')
  const namePlaceholder = String(p.namePlaceholder || 'Adınız Soyadınız')
  const emailPlaceholder = String(p.emailPlaceholder || 'ornek@email.com')
  const messagePlaceholder = String(p.messagePlaceholder || 'Mesajınız...')

  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
  }

  const phoneHref = phone ? `tel:${phone.replace(/\s/g, '')}` : ''
  const emailHref = email ? `mailto:${email}` : ''
  const whatsappHref = whatsapp ? (whatsapp.startsWith('http') ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, '')}`) : ''

  return (
    <section className="py-16 md:py-24" data-section="contact">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
        </div>

        <div className={`grid gap-8 ${showForm && (phone || email || whatsapp || address) ? 'lg:grid-cols-3' : ''} max-w-6xl mx-auto`}>
          {showForm && (
            <div className={phone || email || whatsapp || address ? 'lg:col-span-2' : 'max-w-2xl mx-auto'}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                {sent ? (
                  <p className="text-green-600 font-medium">{successMessage}</p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-1">{nameLabel}</label>
                      <input id="contact-name" name="name" type="text" required className={inputClass} placeholder={namePlaceholder} />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-1">{emailLabel}</label>
                      <input id="contact-email" name="email" type="email" required className={inputClass} placeholder={emailPlaceholder} />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1">{messageLabel}</label>
                      <textarea id="contact-message" name="message" rows={5} required className={`${inputClass} resize-none`} placeholder={messagePlaceholder} />
                    </div>
                    <button type="submit" className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition-colors">
                      {submitLabel}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {(phone || email || whatsapp || address) && (
            <div className="space-y-4">
              {phone && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">{phoneLabel}</h3>
                  <a href={phoneHref} className="text-accent-blue hover:underline">
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">{emailLabel}</h3>
                  <a href={emailHref} className="text-accent-blue hover:underline break-all">
                    {email}
                  </a>
                </div>
              )}
              {whatsapp && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">{whatsappLabel}</h3>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                    {phone || whatsappLabel + ' ile yazın'}
                  </a>
                </div>
              )}
              {address && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">{addressLabel}</h3>
                  <p className="text-slate-600 text-sm">{address}</p>
                </div>
              )}

              {showMap && (
                <div className="rounded-xl border border-slate-200 bg-slate-100 h-48 flex items-center justify-center text-slate-500 text-sm overflow-hidden min-h-[192px]">
                  {mapEmbedUrl ? (
                    <iframe
                      title="Harita"
                      src={mapEmbedUrl}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <span>Harita embed URL ekleyin (Google Maps paylaşım → Harita yerleştir)</span>
                  )}
                </div>
              )}
            </div>
          )}

          {!showForm && !phone && !email && !whatsapp && !address && (
            <p className="text-slate-500 text-center col-span-full">İletişim bilgileri henüz eklenmemiş.</p>
          )}
        </div>
      </div>
    </section>
  )
}
