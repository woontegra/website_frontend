import { SectionHeader } from '../../components/ui/SectionHeader'

export function KvkkPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader title="KVKK Aydınlatma Metni" subtitle="Kişisel verilerinizin işlenmesine ilişkin bilgilendirme." />
        <div className="prose prose-gray max-w-none text-surface-600 space-y-4">
          <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verileriniz; hizmet sunumu, iletişim ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenebilmektedir.</p>
          <p>Veri sorumlusu: Woontegra. İlgili kişi olarak haklarınız (erişim, düzeltme, silme, itiraz vb.) Kanun’da sayılan çerçevede kullanılabilir. Detaylı bilgi ve başvuru için bizimle iletişime geçebilirsiniz.</p>
        </div>
      </div>
    </div>
  )
}
