import { useEffect, useState } from 'react'
import { fetchPageSections } from '../api/pageSections'
import { defaultFAQData } from '../data/allPagesData'
import type { FAQSectionData, HeroSectionData } from '../types/sections'

export type FaqCategory = {
  category: string
  questions: { question: string; answer: string }[]
}

const FALLBACK_CATEGORIES: FaqCategory[] = [
  {
    category: 'Genel',
    questions: [
      {
        question: 'Woontegra tam olarak ne yapıyor?',
        answer:
          'Woontegra, yazılım geliştirme, e-ticaret altyapıları ve dijital sistemler kuran bir teknoloji şirketidir. Aynı zamanda kendi markalarını da geliştirir ve yönetir.',
      },
      {
        question: 'Sadece hizmet mi veriyorsunuz?',
        answer: 'Hayır. Hizmet vermenin yanında kendi ürünlerimizi ve e-ticaret markalarımızı da aktif olarak yönetiyoruz.',
      },
    ],
  },
]

function mapFaqFromApi(page: typeof defaultFAQData | null): {
  hero: { eyebrow: string; title: string; description: string }
  categories: FaqCategory[]
} {
  if (!page?.sections?.length) {
    return {
      hero: {
        eyebrow: 'SSS',
        title: 'Sık Sorulan Sorular',
        description: 'Hizmetlerimiz ve süreçlerimiz hakkında en çok merak edilen sorular.',
      },
      categories: FALLBACK_CATEGORIES,
    }
  }

  const hero = page.sections.find((s) => s.type === 'hero')
  const heroData = (hero?.data ?? {}) as HeroSectionData
  const faqSections = page.sections.filter((s) => s.type === 'faq-list')

  const categories = faqSections
    .map((section) => {
      const data = section.data as FAQSectionData
      return {
        category: data.title || 'Genel',
        questions: Array.isArray(data.items) ? data.items : [],
      }
    })
    .filter((c) => c.questions.length > 0)

  return {
    hero: {
      eyebrow: heroData.tag || 'SSS',
      title: heroData.title || 'Sık Sorulan Sorular',
      description: heroData.subtitle || 'Hizmetlerimiz ve süreçlerimiz hakkında en çok merak edilen sorular.',
    },
    categories: categories.length > 0 ? categories : FALLBACK_CATEGORIES,
  }
}

export function useFaqPageData() {
  const [data, setData] = useState(() => mapFaqFromApi(null))

  useEffect(() => {
    void fetchPageSections('faq').then((page) => setData(mapFaqFromApi(page ?? defaultFAQData)))
  }, [])

  return data
}
