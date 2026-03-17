import { SectionHeader } from '../components/ui/SectionHeader'
import { Card } from '../components/ui/Card'
import { CTA } from '../components/ui/CTA'

export function MarkaPatentPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <section className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-heading">
            Marka & Patent Vekilliği
          </h1>
          <p className="mt-6 text-xl text-surface-600">
            Resmi marka vekili desteğiyle marka başvurusu, takip, itiraz süreçleri ve fikri mülkiyet danışmanlığı. Kurumsal ve güvenilir bir hizmet anlayışıyla yanınızdayız.
          </p>
        </section>

        <section className="mb-16">
          <Card className="p-6 md:p-8 border-accent-blue/20" hover={false}>
            <h2 className="text-xl font-semibold text-heading mb-2">Resmi marka vekili desteği</h2>
            <p className="text-surface-600">
              Woontegra bünyesinde, eşimiz resmi marka vekili olarak marka başvuruları, itirazlar ve tescil süreçlerinde yetkin şekilde hizmet vermektedir. Tüm süreçler yasal çerçevede ve güvenilir biçimde yürütülür.
            </p>
          </Card>
        </section>

        <SectionHeader title="Hizmetler" subtitle="Marka ve fikri mülkiyet alanında sunduğumuz hizmetler." />
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-heading">Marka başvurusu ve takip</h3>
            <p className="mt-2 text-surface-600 text-sm">Araştırma, sınıf seçimi, başvuru hazırlığı ve resmi süreç takibi.</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-heading">İtiraz ve itiraz cevapları</h3>
            <p className="mt-2 text-surface-600 text-sm">İtirazların değerlendirilmesi ve cevap metinlerinin hazırlanması.</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-heading">Marka danışmanlığı</h3>
            <p className="mt-2 text-surface-600 text-sm">Strateji, sınıf seçimi ve portföy yönetimi danışmanlığı.</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-heading">Web sitesi + marka paketleri</h3>
            <p className="mt-2 text-surface-600 text-sm">Kurumsal web sitesi ile marka başvurusunu birlikte sunan paketler.</p>
          </Card>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-heading mb-4">Kimler için uygun?</h2>
          <p className="text-surface-600 mb-4">
            Şirketler, girişimciler, marka sahipleri ve web sitesi ile marka paketi talep eden tüm müşterilerimiz.
          </p>
        </section>

        <CTA
          title="Marka başvurusu veya danışmanlık için iletişime geçin"
          primaryAction={{ label: 'İletişim', href: '/iletisim' }}
          secondaryAction={{ label: 'Teklif Al', href: '/teklif-al' }}
        />
      </div>
    </div>
  )
}
