import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PageHero } from '../components/page/PageHero'
import { CTASection } from '../components/page/CTASection'
import { LAYOUT_CONTAINER_CLASS } from '../lib/layoutConstants'
import { frontendImages } from '../data/frontendImages'
import { useFaqPageData } from '../hooks/useFaqPageData'
import { SURFACE_MUTED } from '../lib/sectionSurfaces'

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-slate-50"
      >
        <span className="pr-4 text-base font-semibold text-slate-900">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-slate-100 px-6 pb-5 pt-2">
          <p className="body-text">{answer}</p>
        </div>
      )}
    </div>
  )
}

export function FaqPage() {
  const { hero, categories } = useFaqPageData()
  const categoryNames = useMemo(() => categories.map((c) => c.category), [categories])
  const [activeCategory, setActiveCategory] = useState('')

  const selectedCategory = activeCategory || categoryNames[0] || 'Genel'
  const activeQuestions = categories.find((c) => c.category === selectedCategory)?.questions ?? []

  return (
    <div className="bg-white">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={frontendImages.pages.faq}
        imageAlt="Woontegra SSS"
        highlights={[{ title: 'Hızlı yanıtlar' }, { title: 'Kategori bazlı düzen' }]}
      />

      <section className={`${SURFACE_MUTED} py-20 md:py-24`}>
        <div className={`${LAYOUT_CONTAINER_CLASS} max-w-4xl`}>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categoryNames.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {activeQuestions.map((item) => (
              <AccordionItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Yanıtını bulamadınız mı?"
        description="Sorularınız için ekibimizle doğrudan iletişime geçebilirsiniz."
        buttonText="İletişime Geç"
      />
    </div>
  )
}
