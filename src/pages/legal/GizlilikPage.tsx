import { SectionHeader } from '../../components/ui/SectionHeader'

export function GizlilikPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader title="Gizlilik Politikası" subtitle="Verilerinizin korunması ve kullanımı." />
        <div className="prose prose-gray max-w-none text-surface-600 space-y-4">
          <p>Woontegra olarak gizliliğinize saygı gösteriyoruz. Topladığımız veriler yalnızca hizmet sunumu, iletişim ve yasal zorunluluklar kapsamında kullanılır. Verileriniz üçüncü taraflarla paylaşılmaz; güvenli ortamda saklanır.</p>
          <p>Çerez kullanımı, site deneyimini iyileştirmek ve analiz amacıyla sınırlı şekilde kullanılabilir. Detaylar için Çerez Politikası sayfamıza bakabilirsiniz.</p>
        </div>
      </div>
    </div>
  )
}
