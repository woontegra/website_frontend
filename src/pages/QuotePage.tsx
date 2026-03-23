import { useState } from 'react'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { Button } from '../components/ui/Button'

const projectTypes = [
  { id: 'software', label: 'Yazılım Geliştirme', icon: '💻' },
  { id: 'web-design', label: 'Web Tasarım', icon: '🎨' },
  { id: 'ecommerce', label: 'E-Ticaret', icon: '🛒' },
  { id: 'saas', label: 'SaaS Ürün', icon: '☁️' },
  { id: 'trademark', label: 'Marka & Patent', icon: '📋' },
  { id: 'consulting', label: 'Danışmanlık', icon: '💡' },
  { id: 'game', label: 'Oyun Geliştirme', icon: '🎮' },
]

const budgetOptions = [
  { value: '10-50K', label: '10-50K TL' },
  { value: '50-100K', label: '50-100K TL' },
  { value: '100K+', label: '100K+ TL' },
]

const timelineOptions = [
  { value: 'urgent', label: 'Acil' },
  { value: '1-3-months', label: '1-3 Ay' },
  { value: 'flexible', label: 'Esnek' },
]

export function QuotePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    company: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.type) newErrors.type = 'Lütfen bir proje türü seçin'
    }

    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = 'Proje açıklaması gerekli'
      if (!formData.budget) newErrors.budget = 'Bütçe aralığı seçin'
      if (!formData.timeline) newErrors.timeline = 'Zaman seçin'
    }

    if (step === 3) {
      if (!formData.name.trim()) newErrors.name = 'Ad Soyad gerekli'
      if (!formData.email.trim()) {
        newErrors.email = 'E-posta gerekli'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Geçerli bir e-posta adresi girin'
      }
      if (!formData.phone.trim()) newErrors.phone = 'Telefon gerekli'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        setCurrentStep(4)
      } else {
        setErrors({ submit: 'Bir hata oluştu. Lütfen tekrar deneyin.' })
      }
    } catch (error) {
      setErrors({ submit: 'Bağlantı hatası. Lütfen tekrar deneyin.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* HERO */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Projenizi Anlatın, Size Özel Teklif Hazırlayalım
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            İhtiyacınızı birkaç adımda anlatın, size en uygun çözümü sunalım.
          </p>
        </div>
      </section>

      {/* STEP INDICATOR */}
      <section className="py-8 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    step < currentStep
                      ? 'bg-green-600 text-white'
                      : step === currentStep
                      ? 'bg-slate-900 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? <Check className="w-6 h-6" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12">
            {/* STEP 1 - PROJE TÜRÜ */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                  Ne tür bir proje planlıyorsunuz?
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                        formData.type === type.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-3">{type.icon}</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.type && (
                  <p className="text-red-600 text-center">{errors.type}</p>
                )}
              </div>
            )}

            {/* STEP 2 - PROJE DETAYI */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                  Projenizi kısaca anlatın
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-slate-900 mb-3">
                      Proje Açıklaması
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={6}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none text-lg"
                      placeholder="Projeniz hakkında detaylı bilgi verin..."
                    />
                    {errors.description && (
                      <p className="text-red-600 mt-2">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-slate-900 mb-3">
                      Bütçe Aralığı
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none text-lg"
                    >
                      <option value="">Seçin</option>
                      {budgetOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.budget && (
                      <p className="text-red-600 mt-2">{errors.budget}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-slate-900 mb-3">
                      Zaman
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) =>
                        setFormData({ ...formData, timeline: e.target.value })
                      }
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none text-lg"
                    >
                      <option value="">Seçin</option>
                      {timelineOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.timeline && (
                      <p className="text-red-600 mt-2">{errors.timeline}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 - İLETİŞİM */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                  İletişim Bilgileri
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-slate-900 mb-3">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none text-lg"
                      placeholder="Adınız ve soyadınız"
                    />
                    {errors.name && (
                      <p className="text-red-600 mt-2">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-slate-900 mb-3">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none text-lg"
                      placeholder="ornek@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 mt-2">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-slate-900 mb-3">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none text-lg"
                      placeholder="0532 XXX XX XX"
                    />
                    {errors.phone && (
                      <p className="text-red-600 mt-2">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-slate-900 mb-3">
                      Şirket Adı <span className="text-gray-500">(Opsiyonel)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none text-lg"
                      placeholder="Şirket adınız"
                    />
                  </div>
                </div>
                {errors.submit && (
                  <p className="text-red-600 text-center">{errors.submit}</p>
                )}
              </div>
            )}

            {/* STEP 4 - ONAY */}
            {currentStep === 4 && (
              <div className="text-center space-y-8 py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900">
                  Teklif Talebiniz Hazır
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Bilgilerinizi aldık. En kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <Button variant="green" to="/" className="text-lg px-12 py-4 mt-8">
                  Ana Sayfaya Dön
                </Button>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            {currentStep < 4 && (
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
                {currentStep > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-8 py-4 text-slate-700 hover:text-slate-900 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Geri
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition-colors"
                  >
                    İleri
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
