import { ServiceDetailLayout } from '../components/services/ServiceDetailLayout'
import { ecommerceDetail } from '../data/serviceDetailContent'
import { defaultEcommerceData } from '../data/allPagesData'
import { useHeroSection } from '../hooks/useHeroSection'

export function EcommercePage() {
  const { heroData } = useHeroSection('ecommerce', defaultEcommerceData)
  return <ServiceDetailLayout content={ecommerceDetail} heroOverride={heroData} />
}
