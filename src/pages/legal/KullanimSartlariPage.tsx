import { SectionHeader } from '../../components/ui/SectionHeader'

export function KullanimSartlariPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader title="Kullanım Şartları" subtitle="Web sitemizi kullanım koşulları." />
        <div className="prose prose-gray max-w-none text-surface-600 space-y-4">
          <p>Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Sitedeki içerikler genel bilgilendirme amaçlıdır; profesyonel hukuki veya teknik tavsiye yerine geçmez.</p>
          <p>İçerikler izinsiz kopyalanamaz veya ticari amaçla kullanılamaz. Woontegra, site içeriğinde veya üçüncü taraf bağlantılarında yer alan bilgilerin doğruluğundan her zaman sorumlu tutulamaz.</p>
        </div>
      </div>
    </div>
  )
}
