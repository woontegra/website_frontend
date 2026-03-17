import { StatCard } from '../ui/StatCard'

const stats = [
  { value: '50+', label: 'Tamamlanan proje' },
  { value: '8+', label: 'Hizmet alanı' },
  { value: '100%', label: 'Müşteri odaklı süreç' },
]

export function StatsSection() {
  return (
    <section className="py-24 md:py-28 bg-white animate-fade-up">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {stats.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
