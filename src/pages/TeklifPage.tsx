import { useState } from 'react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const projectTypes = ['Web sitesi', 'E-ticaret', 'Yazılım / SaaS', 'Marka tescil', 'Oyun / Dijital ürün', 'Danışmanlık', 'Diğer']
const serviceOptions = ['Yazılım Geliştirme', 'Web Tasarım', 'E-Ticaret', 'SaaS', 'Marka & Patent', 'Oyun Geliştirme', 'Dijital Danışmanlık']

export function TeklifPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="py-16 md:py-24 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-heading mb-4">Talebiniz alındı</h1>
          <p className="text-surface-600">En kısa sürede sizinle iletişime geçeceğiz.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <SectionHeader
          title="Teklif Al"
          subtitle="Proje türü ve hizmet seçiminizi yapın, kısa brief ve iletişim bilgilerinizi paylaşın."
        />

        <Card className="p-6 md:p-8">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-accent-blue' : 'bg-surface-200'}`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Proje türü</label>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="projectType" value={t} className="rounded border-white/20 text-accent-blue focus:ring-accent-blue" />
                        <span className="text-heading text-sm">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Hizmet</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue">
                    <option value="">Seçin</option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Button type="button" onClick={() => setStep(2)}>İleri</Button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label htmlFor="brief" className="block text-sm font-medium text-heading mb-2">Kısa brief / ihtiyaç</label>
                  <textarea id="brief" name="brief" rows={5} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 resize-none" placeholder="Projenizi kısaca anlatın..." />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>Geri</Button>
                  <Button type="button" onClick={() => setStep(3)}>İleri</Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-heading mb-2">Ad Soyad</label>
                  <input id="contactName" name="contactName" type="text" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-heading mb-2">E-posta</label>
                  <input id="contactEmail" name="contactEmail" type="email" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-heading mb-2">Telefon</label>
                  <input id="contactPhone" name="contactPhone" type="tel" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue" />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>Geri</Button>
                  <Button type="submit">Teklif Talebini Gönder</Button>
                </div>
              </>
            )}
          </form>
        </Card>
      </div>
    </div>
  )
}
