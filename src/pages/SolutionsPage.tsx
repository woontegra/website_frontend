import { subBrands } from '../data/subBrands'
import { SectionHeader } from '../components/ui/SectionHeader'
import { SolutionCard } from '../components/ui/SolutionCard'

const extraSolutions = [
  { id: 'marka-patent', name: 'Marka & Patent Vekilliği', description: 'Resmi marka vekili desteğiyle marka başvurusu, takip ve danışmanlık.', href: '/hizmetler/marka-patent-vekilligi' },
  { id: 'e-ticaret', name: 'E-Ticaret Çözümleri', description: 'WooCommerce ve dijital ticaret altyapıları.', href: '/hizmetler/e-ticaret' },
]

export function SolutionsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Çözümler ve alt markalar"
          subtitle="Woontegra çatısı altındaki ürünler, markalar ve dijital çözümler."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {subBrands.map((brand) => (
            <SolutionCard key={brand.id} name={brand.name} description={brand.description} href={brand.href} />
          ))}
          {extraSolutions.map((s) => (
            <SolutionCard key={s.id} name={s.name} description={s.description} href={s.href} />
          ))}
        </div>
      </div>
    </div>
  )
}
