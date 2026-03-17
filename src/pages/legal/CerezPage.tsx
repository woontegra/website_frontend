import { SectionHeader } from '../../components/ui/SectionHeader'

export function CerezPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader title="Çerez Politikası" subtitle="Web sitemizde kullanılan çerezler hakkında." />
        <div className="prose prose-gray max-w-none text-surface-600 space-y-4">
          <p>Bu site, kullanıcı deneyimini iyileştirmek ve site trafiğini analiz etmek amacıyla çerez kullanabilir. Zorunlu çerezler sitenin çalışması için gereklidir; tercih çerezleri ise onayınıza bağlıdır.</p>
          <p>Tarayıcı ayarlarınızdan çerezleri kapatabilirsiniz; ancak bu durumda bazı özellikler kısıtlanabilir.</p>
        </div>
      </div>
    </div>
  )
}
