import { SectionHeader } from '../ui/SectionHeader'
import { FeatureCard } from '../ui/FeatureCard'

const reasons = [
  {
    title: 'Tek çatı, çok alan',
    description: 'Yazılım, e-ticaret, marka ve dijital ürün ihtiyaçlarınızı tek adreste topluyoruz.',
    icon: (
      <svg className="h-10 w-10 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: 'Teknoloji odaklı üretim',
    description: 'Güncel stack, temiz kod ve sürdürülebilir altyapı ile projeler üretiyoruz.',
    icon: (
      <svg className="h-10 w-10 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Kurumsal güven',
    description: 'Süreçler şeffaf, iletişim düzenli; teslimatta tutarlılık önceliğimiz.',
    icon: (
      <svg className="icon-green h-10 w-10 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Büyüme odaklı yaklaşım',
    description: 'Projelerinizi sadece teslim etmiyoruz; ölçeklenebilir büyüme için tasarlıyoruz.',
    icon: (
      <svg className="icon-green h-10 w-10 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
]

export function WhyWoontegra() {
  return (
    <section className="animate-fade-up bg-white py-24 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Neden Woontegra?"
          subtitle="Teknolojide çok yönlü yetkinlik ve kurumsal güveni bir arada sunuyoruz."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {reasons.map((r) => (
            <FeatureCard key={r.title} title={r.title} description={r.description} icon={r.icon} />
          ))}
        </div>
      </div>
    </section>
  )
}
