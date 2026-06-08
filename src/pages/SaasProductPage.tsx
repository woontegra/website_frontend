import { ServiceDetailLayout } from '../components/services/ServiceDetailLayout'
import { saasProductDetail } from '../data/serviceDetailContent'
import { defaultSaasData } from '../data/allPagesData'
import { useHeroSection } from '../hooks/useHeroSection'

export function SaasProductPage() {
  const { heroData } = useHeroSection('saas', defaultSaasData)
  return <ServiceDetailLayout content={saasProductDetail} heroOverride={heroData} />
}
