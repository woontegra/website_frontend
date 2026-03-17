import { subBrands } from '../../data/subBrands'
import { SectionHeader } from '../ui/SectionHeader'
import { SolutionCard } from '../ui/SolutionCard'
import { Button } from '../ui/Button'

export function SubBrandsSection() {
  return (
    <section className="py-24 md:py-28 bg-slate-50 animate-fade-up">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Çözümler ve alt markalar"
          subtitle="Woontegra çatısı altında ürünler ve markalar."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {subBrands.map((brand) => (
            <SolutionCard
              key={brand.id}
              name={brand.name}
              description={brand.description}
              href={brand.href}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="secondary" to="/cozumler">
            Tüm çözümleri görüntüle
          </Button>
        </div>
      </div>
    </section>
  )
}
