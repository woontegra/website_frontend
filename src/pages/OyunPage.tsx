import { SectionHeader } from '../components/ui/SectionHeader'
import { Card } from '../components/ui/Card'
import { CTA } from '../components/ui/CTA'

export function OyunPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <section className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-heading">
            Oyun ve Dijital Ürün Geliştirme
          </h1>
          <p className="mt-6 text-xl text-surface-600">
            Geliştirmekte olduğumuz dijital ürünler ve oyun projeleri. Teknoloji odaklı, vizyoner bir üretim yaklaşımıyla hareket ediyoruz.
          </p>
        </section>

        <SectionHeader title="Yaklaşım" subtitle="Modern ve vizyoner sunum." />
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-heading">Dijital ürünler</h3>
            <p className="mt-2 text-surface-600 text-sm">
              Oyun dışında eğitim, simülasyon ve interaktif dijital ürünler.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-heading">Oyun projeleri</h3>
            <p className="mt-2 text-surface-600 text-sm">
              Mobil ve web tabanlı oyun geliştirme ve yayın süreçleri.
            </p>
          </Card>
        </div>

        <div className="card-light p-8 md:p-12 text-center mb-16">
          <h2 className="text-xl font-semibold text-heading mb-2">Projeler</h2>
          <p className="text-surface-600 text-sm">Geliştirmekte olduğumuz projeler bu alanda tanıtılacak.</p>
        </div>

        <CTA
          title="Oyun veya dijital ürün projeniz için konuşalım"
          primaryAction={{ label: 'İletişim', href: '/iletisim' }}
          secondaryAction={{ label: 'Teklif Al', href: '/teklif-al' }}
        />
      </div>
    </div>
  )
}
