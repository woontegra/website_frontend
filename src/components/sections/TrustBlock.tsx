import { SectionHeader } from '../ui/SectionHeader'
import { FeatureCard } from '../ui/FeatureCard'

const items = [
  {
    title: 'Çok yönlü dijital yapı',
    description: 'Yazılımdan e-ticarete, marka vekilliğinden oyun geliştirmeye tek ekosistem.',
  },
  {
    title: 'Farklı sektörlerde üretim',
    description: 'Kurumsal, startup ve bireysel müşterilere özelleştirilmiş çözümler.',
  },
  {
    title: 'Modern altyapı',
    description: 'Güncel teknolojiler, güvenli ve ölçeklenebilir mimari.',
  },
]

export function TrustBlock() {
  return (
    <section className="animate-fade-up bg-slate-50 py-24 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Güven ve yetkinlik"
          subtitle="Teknolojide çok yönlü üretim, tek sorumlu çözüm ortağı."
        />
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {items.map((item) => (
            <FeatureCard key={item.title} title={item.title} description={item.description} />
          ))}
        </div>
      </div>
    </section>
  )
}
