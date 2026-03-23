import { subBrands } from '../../data/subBrands'
import { SectionHeader } from '../ui/SectionHeader'
import { SubBrandShowcaseCard } from '../ui/SubBrandShowcaseCard'
import { Button } from '../ui/Button'

export function SubBrandsSection() {
  return (
    <section className="animate-fade-up bg-gradient-to-b from-slate-100/80 via-[#eef2f8]/90 to-slate-50 py-24 md:py-28">
      <div className="container mx-auto max-w-[1280px] px-4">
        <SectionHeader
          title="Çözümler ve alt markalar"
          subtitle="Woontegra çatısı altında ürünler ve markalar."
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {subBrands.map((brand) => (
            <SubBrandShowcaseCard
              key={brand.id}
              name={brand.name}
              description={brand.description}
              href={brand.href}
              logo={brand.logo}
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
