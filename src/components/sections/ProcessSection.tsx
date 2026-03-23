import { SectionHeader } from '../ui/SectionHeader'

const steps = [
  { step: '01', title: 'İhtiyaç analizi', description: 'Hedeflerinizi ve gereksinimlerinizi birlikte netleştiriyoruz.' },
  { step: '02', title: 'Teklif ve planlama', description: 'Kapsam, süre ve bütçe çerçevesinde teklif sunuyoruz.' },
  { step: '03', title: 'Geliştirme ve tasarım', description: 'Süreç boyunca düzenli paylaşım ve revizyon imkânı.' },
  { step: '04', title: 'Teslim ve destek', description: 'Teslim sonrası eğitim, bakım ve destek sunuyoruz.' },
]

export function ProcessSection() {
  return (
    <section className="animate-fade-up bg-slate-50 py-24 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Süreç nasıl işliyor?"
          subtitle="Şeffaf ve düzenli bir iş birliği süreciyle projelerinizi hayata geçiriyoruz."
        />
        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" style={{ left: '12.5%', right: '12.5%' }} />
          <div className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative flex gap-6">
                <span
                  className="shrink-0 select-none text-5xl font-bold leading-none text-slate-200 md:text-6xl"
                  aria-hidden
                >
                  {s.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
