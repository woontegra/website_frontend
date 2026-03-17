import { SectionHeader } from '../components/ui/SectionHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { CTA } from '../components/ui/CTA'

const modules = [
  'Ücret hesaplamaları',
  'Fazla mesai ve işe iade hesaplamaları',
  'Kıdem tazminatı',
  'İhbar tazminatı',
  'Diğer iş hukuku hesaplamaları',
]

const forWho = ['Bilirkişiler', 'Avukatlar', 'İnsan kaynakları uzmanları', 'Mahkemeler ve rapor birimleri']

export function BilirksiPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <section className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-heading">
            Bilirkişi Hesaplama Programı
          </h1>
          <p className="mt-6 text-xl text-surface-600">
            Bilirkişi raporları için hesaplama süreçlerini dakikalar içinde tamamlayan profesyonel yazılım. Excel ile saatler süren işlemler artık saniyeler içinde.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" to="/teklif-al">
              Demo / Teklif Al
            </Button>
            <Button variant="outline" size="lg" to="/iletisim">
              İletişime Geç
            </Button>
          </div>
        </section>

        <section className="mb-16">
          <SectionHeader title="Neden Excel yerine yazılım?" subtitle="Zaman kazanın, hata oranını düşürün." />
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-blue">30 sn</div>
              <p className="mt-2 text-surface-600 text-sm">Ortalama hesaplama süresi</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-green">%0</div>
              <p className="mt-2 text-surface-600 text-sm">Formül hatası riski</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-heading">1 tık</div>
              <p className="mt-2 text-surface-600 text-sm">Rapor çıktısı</p>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-heading mb-4">Hangi hesaplamalar var?</h2>
          <p className="text-surface-600 mb-6">
            İş hukuku ve bilirkişi raporlarına yönelik tüm temel hesaplama türleri tek arayüzde.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-surface-600">
            {modules.map((m) => (
              <li key={m} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-blue" />
                {m}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-heading mb-4">Kimler için?</h2>
          <div className="flex flex-wrap gap-3">
            {forWho.map((w) => (
              <span key={w} className="px-4 py-2 rounded-full bg-surface-100 text-surface-700 text-sm">
                {w}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="card-light p-8 md:p-12 text-center">
            <h2 className="text-2xl font-semibold text-heading mb-2">Ekran alanları</h2>
            <p className="text-surface-600 text-sm">Ürün arayüzü görselleri burada yer alacak.</p>
            <div className="mt-6 h-48 rounded-xl bg-surface-100 flex items-center justify-center text-surface-500">
              Görsel alanı
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="card-light p-8 md:p-12 text-center">
            <h2 className="text-2xl font-semibold text-heading mb-2">Video alanı</h2>
            <p className="text-surface-600 text-sm">Tanıtım veya kullanım videoları burada gömülebilir.</p>
            <div className="mt-6 h-48 rounded-xl bg-surface-100 flex items-center justify-center text-surface-500">
              Video alanı
            </div>
          </div>
        </section>

        <CTA
          title="Bilirkişi Hesaplama Programı için teklif alın"
          subtitle="Demo talebi veya lisans bilgisi için iletişime geçin."
          primaryAction={{ label: 'Teklif Al', href: '/teklif-al' }}
          secondaryAction={{ label: 'İletişim', href: '/iletisim' }}
        />
      </div>
    </div>
  )
}
