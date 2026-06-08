import { ServiceDetailLayout } from '../components/services/ServiceDetailLayout'
import { webDesignDetail } from '../data/serviceDetailContent'
import { defaultWebDesignData } from '../data/allPagesData'
import { useHeroSection } from '../hooks/useHeroSection'

export function WebDesignPage() {
  const { heroData } = useHeroSection('web-design', defaultWebDesignData)
  return <ServiceDetailLayout content={webDesignDetail} heroOverride={heroData} />
}
