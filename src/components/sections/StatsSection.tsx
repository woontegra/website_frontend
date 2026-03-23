import { StatCard } from '../ui/StatCard'

const stats = [
  { value: '50+', label: 'Tamamlanan proje' },
  { value: '8+', label: 'Hizmet alanı' },
  { value: '100%', label: 'Müşteri odaklı süreç' },
]

export function StatsSection() {
  return (
    <section className="animate-fade-up bg-white py-24 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:gap-12">
          {stats.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
