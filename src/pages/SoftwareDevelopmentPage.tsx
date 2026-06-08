import { ServiceDetailLayout } from '../components/services/ServiceDetailLayout'
import { softwareDevelopmentDetail } from '../data/serviceDetailContent'
import { defaultSoftwareDevData } from '../data/allPagesData'
import { useHeroSection } from '../hooks/useHeroSection'

export function SoftwareDevelopmentPage() {
  const { heroData } = useHeroSection('software-dev', defaultSoftwareDevData)
  return <ServiceDetailLayout content={softwareDevelopmentDetail} heroOverride={heroData} />
}
