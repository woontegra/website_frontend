import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'

const faqData = [
  {
    category: 'Genel Sorular',
    questions: [
      {
        question: 'Woontegra tam olarak ne yapıyor?',
        answer: 'Woontegra, yazılım geliştirme, e-ticaret altyapıları ve dijital sistemler kuran bir teknoloji şirketidir. Aynı zamanda kendi markalarını da geliştirir ve yönetir.',
      },
      {
        question: 'Sadece hizmet mi veriyorsunuz?',
        answer: 'Hayır. Hizmet vermenin yanında kendi ürünlerimizi ve e-ticaret markalarımızı da aktif olarak yönetiyoruz.',
      },
    ],
  },
  {
    category: 'Yazılım',
    questions: [
      {
        question: 'Hazır sistem mi kullanıyorsunuz?',
        answer: 'Hayır. İhtiyaca göre özel yazılım geliştiriyoruz.',
      },
      {
        question: 'Yazılım ne kadar sürede tamamlanır?',
        answer: 'Projenin kapsamına göre değişir. Basit projeler birkaç hafta, daha kapsamlı sistemler daha uzun sürebilir.',
      },
    ],
  },
  {
    category: 'E-Ticaret',
    questions: [
      {
        question: 'E-ticaret sitesi kuruyor musunuz?',
        answer: 'Evet. Satış odaklı ve yönetilebilir e-ticaret sistemleri kuruyoruz.',
      },
      {
        question: 'Ürün yükleme hizmeti var mı?',
        answer: 'Evet, talep edilirse ürün ve içerik girişleri ek hizmet olarak sağlanır.',
      },
    ],
  },
  {
    category: 'Marka & Patent',
    questions: [
      {
        question: 'Marka tescil sürecini siz mi yürütüyorsunuz?',
        answer: 'Evet. Süreç uzman vekil desteği ile baştan sona yönetilir.',
      },
      {
        question: 'Başvuru ne kadar sürer?',
        answer: 'Başvuru kısa sürede yapılır, ancak resmi tescil süreci birkaç ay sürebilir.',
      },
    ],
  },
  {
    category: 'Süreç',
    questions: [
      {
        question: 'Proje süreci nasıl ilerliyor?',
        answer: 'Analiz, planlama, geliştirme ve yayın aşamaları ile ilerliyoruz.',
      },
      {
        question: 'Teslim sonrası destek veriyor musunuz?',
        answer: 'Evet. Proje sonrası belirli süre destek sağlıyoruz.',
      },
    ],
  },
]

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-lg font-semibold text-slate-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-600 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-8 pb-6 pt-2">
          <p className="text-slate-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export function FaqPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Sık Sorulan Sorular
          </h1>
          <p className="text-2xl text-gray-300 leading-relaxed">
            Hizmetlerimiz ve süreçlerimiz hakkında en çok merak edilen sorular.
          </p>
        </div>
      </section>

      {/* SSS LİSTESİ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-16">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((item, itemIndex) => (
                    <AccordionItem
                      key={itemIndex}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Aklınıza Takılan Başka Bir Şey Mi Var?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Sorularınız için bizimle iletişime geçebilirsiniz.
          </p>
          <Button variant="outline" to="/iletisim" className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all">
            İletişime Geç
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
