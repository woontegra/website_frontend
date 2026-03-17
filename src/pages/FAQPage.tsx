import { useState } from 'react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { faqs, faqCategories } from '../data/faq'
import { FAQItem } from '../components/ui/FAQItem'

export function FAQPage() {
  const [filter, setFilter] = useState<string | null>(null)

  const filtered = filter ? faqs.filter((f) => f.category === filter) : faqs

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Sık Sorulan Sorular"
          subtitle="Hizmetler, proje süreçleri, marka tescil ve destek hakkında merak ettikleriniz."
        />

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === null ? 'bg-accent-blue text-white' : 'bg-surface-100 text-surface-600 hover:text-heading'}`}
          >
            Tümü
          </button>
          {faqCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === c ? 'bg-accent-blue text-white' : 'bg-surface-100 text-surface-600 hover:text-heading'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="max-w-3xl space-y-3">
          {filtered.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  )
}
