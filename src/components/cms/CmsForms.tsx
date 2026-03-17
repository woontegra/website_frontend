import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

export function CmsContactForm({ content }: { content: Record<string, unknown> }) {
  const c = content
  const [sent, setSent] = useState(false)
  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue'

  if (sent) {
    return (
      <section className="py-8 container mx-auto px-4 max-w-4xl">
        <p className="text-accent-green font-medium">{String(c.successMessage ?? 'Mesajınız alındı.')}</p>
      </section>
    )
  }

  return (
    <section className="py-8 container mx-auto px-4 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6 md:p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">{String(c.nameLabel ?? 'Ad Soyad')}</label>
                <input name="name" type="text" required className={inputClass} placeholder={String(c.namePlaceholder ?? '')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">{String(c.emailLabel ?? 'E-posta')}</label>
                <input name="email" type="email" required className={inputClass} placeholder={String(c.emailPlaceholder ?? '')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">{String(c.messageLabel ?? 'Mesaj')}</label>
                <textarea name="message" rows={5} required className={`${inputClass} resize-none`} placeholder={String(c.messagePlaceholder ?? '')} />
              </div>
              <Button type="submit">{String(c.submitLabel ?? 'Gönder')}</Button>
            </form>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-2">{String(c.sidebarTitleWhatsapp ?? 'WhatsApp')}</h3>
            <a href={String(c.sidebarWhatsappHref ?? '#')} className="text-accent-blue hover:underline" target="_blank" rel="noopener noreferrer">
              {String(c.sidebarWhatsapp ?? '')}
            </a>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-2">{String(c.sidebarTitleEmail ?? 'E-posta')}</h3>
            <a href={`mailto:${c.sidebarEmail}`} className="text-accent-blue hover:underline">
              {String(c.sidebarEmail ?? '')}
            </a>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-2">{String(c.sidebarTitlePhone ?? 'Telefon')}</h3>
            <a href={`tel:${String(c.sidebarPhone ?? '').replace(/\s/g, '')}`} className="text-accent-blue hover:underline">
              {String(c.sidebarPhone ?? '')}
            </a>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-2">{String(c.sidebarTitleAddress ?? 'Adres')}</h3>
            <p className="text-slate-600 text-sm">{String(c.sidebarAddress ?? '')}</p>
          </Card>
          <div className="h-48 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-sm">{String(c.mapCaption ?? '')}</div>
        </div>
      </div>
    </section>
  )
}

export function CmsQuoteForm({ content }: { content: Record<string, unknown> }) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const projectTypes = (content.projectTypes as string[]) ?? []
  const serviceOptions = (content.serviceOptions as string[]) ?? []
  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue'

  if (submitted) {
    return (
      <div className="py-16 text-center px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">{String(content.successTitle ?? 'Talebiniz alındı')}</h1>
        <p className="text-slate-600">{String(content.successMessage ?? '')}</p>
      </div>
    )
  }

  return (
    <div className="py-8 container mx-auto px-4 max-w-2xl">
      <Card className="p-6 md:p-8">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-accent-blue' : 'bg-slate-200'}`} />
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          className="space-y-6"
        >
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">{String(content.projectTypeLabel ?? 'Proje türü')}</label>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="projectType" value={t} className="text-accent-blue" />
                      <span className="text-slate-900 text-sm">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">{String(content.serviceLabel ?? 'Hizmet')}</label>
                <select className={inputClass} name="service" defaultValue="">
                  <option value="">{String(content.servicePlaceholder ?? 'Seçin')}</option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="button" onClick={() => setStep(2)}>
                {String(content.nextLabel ?? 'İleri')}
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label htmlFor="brief" className="block text-sm font-medium text-slate-900 mb-2">
                  {String(content.briefLabel ?? 'Kısa brief')}
                </label>
                <textarea
                  id="brief"
                  name="brief"
                  rows={5}
                  className={`${inputClass} resize-none placeholder-slate-400`}
                  placeholder={String(content.briefPlaceholder ?? '')}
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  {String(content.backLabel ?? 'Geri')}
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  {String(content.nextLabel ?? 'İleri')}
                </Button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">{String(content.nameLabel ?? 'Ad Soyad')}</label>
                <input name="contactName" type="text" required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">{String(content.emailLabel ?? 'E-posta')}</label>
                <input name="contactEmail" type="email" required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">{String(content.phoneLabel ?? 'Telefon')}</label>
                <input name="contactPhone" type="tel" className={inputClass} />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                  {String(content.backLabel ?? 'Geri')}
                </Button>
                <Button type="submit">{String(content.submitLabel ?? 'Gönder')}</Button>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  )
}
