import { SectionHeader } from '../components/ui/SectionHeader'
import { Card } from '../components/ui/Card'

export function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Hakkımızda"
          subtitle="Woontegra; yazılım, dijital ticaret ve teknoloji çözümlerinde çok yönlü üretim yapan bir teknoloji şirketidir."
        />

        <div className="max-w-3xl mx-auto space-y-8 text-surface-600">
          <p className="text-lg">
            Vizyonumuz, farklı sektörlerdeki ihtiyaçları tek çatı altında karşılayan, güvenilir ve modern bir teknoloji ortağı olmaktır. Yazılım geliştirme, SaaS ürünleri, e-ticaret altyapıları, web tasarım, marka ve patent vekilliği, oyun ve dijital ürün geliştirme alanlarında hizmet veriyoruz.
          </p>
          <p>
            Teknoloji, üretim ve büyüme odaklı bir yaklaşımla projeleri sadece teslim etmiyor; ölçeklenebilir, sürdürülebilir ve müşteri odaklı çözümler sunuyoruz. Kurumsal müşterilerden startup’lara, bireysel girişimcilerden marka sahiplerine kadar geniş bir yelpazede çalışıyoruz.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-heading">Misyon</h3>
            <p className="mt-2 text-surface-600 text-sm">
              Dijital dönüşüm ihtiyaçlarını tek adreste, güvenilir ve modern çözümlerle karşılamak.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-heading">Vizyon</h3>
            <p className="mt-2 text-surface-600 text-sm">
              Türkiye’de çok yönlü teknoloji şirketi olarak tanınan, güven veren bir marka olmak.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-heading">Değerler</h3>
            <p className="mt-2 text-surface-600 text-sm">
              Şeffaflık, kalite, müşteri odaklılık ve sürekli gelişim.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
