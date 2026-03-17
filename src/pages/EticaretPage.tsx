import { SectionHeader } from '../components/ui/SectionHeader'
import { Card } from '../components/ui/Card'
import { CTA } from '../components/ui/CTA'

const features = [
  { title: 'WooCommerce altyapıları', desc: 'Güvenilir ve ölçeklenebilir e-ticaret mağazaları.' },
  { title: 'Site kurulumları', desc: 'Tema, ürün yapısı ve sayfa düzenleri.' },
  { title: 'Ödeme sistemleri', desc: 'İyzico, PayTR ve diğer ödeme entegrasyonları.' },
  { title: 'Ürün / kategori / altyapı', desc: 'Ürün yönetimi, stok ve kargo entegrasyonları.' },
]

export function EticaretPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <section className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-heading">
            E-Ticaret ve Dijital Ticaret Çözümleri
          </h1>
          <p className="mt-6 text-xl text-surface-600">
            WooCommerce altyapıları, mağaza kurulumları, ödeme sistemleri ve ürün/kategori yönetimi ile markalar için dijital ticaret çözümleri sunuyoruz.
          </p>
        </section>

        <SectionHeader title="Neler sunuyoruz?" subtitle="E-ticaret projeleriniz için uçtan uca hizmet." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((f) => (
            <Card key={f.title} className="p-6">
              <h3 className="text-lg font-semibold text-heading">{f.title}</h3>
              <p className="mt-2 text-surface-600 text-sm">{f.desc}</p>
            </Card>
          ))}
        </div>

        <CTA
          title="E-ticaret projeniz için teklif alın"
          primaryAction={{ label: 'Teklif Al', href: '/teklif-al' }}
          secondaryAction={{ label: 'İletişim', href: '/iletisim' }}
        />
      </div>
    </div>
  )
}
