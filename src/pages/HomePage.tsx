import { Hero } from '../components/sections/Hero'
import { TrustBlock } from '../components/sections/TrustBlock'
import { ServiceCards } from '../components/sections/ServiceCards'
import { SubBrandsSection } from '../components/sections/SubBrandsSection'
import { WhyWoontegra } from '../components/sections/WhyWoontegra'
import { ProcessSection } from '../components/sections/ProcessSection'
import { StatsSection } from '../components/sections/StatsSection'
import { CTA } from '../components/ui/CTA'

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustBlock />
      <ServiceCards />
      <SubBrandsSection />
      <WhyWoontegra />
      <ProcessSection />
      <StatsSection />
      <CTA
        title="Projenizi birlikte hayata geçirelim"
        subtitle="Hangi alanda destek almak istediğinizi söyleyin, size özel teklif hazırlayalım."
        primaryAction={{ label: 'İletişime Geç', href: '/iletisim' }}
        secondaryAction={{ label: 'Teklif Al', href: '/teklif-al' }}
      />
    </>
  )
}
