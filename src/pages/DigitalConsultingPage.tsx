import { ServiceDetailLayout } from '../components/services/ServiceDetailLayout'
import { digitalConsultingDetail } from '../data/serviceDetailContent'
import { defaultConsultingData } from '../data/allPagesData'
import { useHeroSection } from '../hooks/useHeroSection'

export function DigitalConsultingPage() {
  const { heroData } = useHeroSection('consulting', defaultConsultingData)
  return <ServiceDetailLayout content={digitalConsultingDetail} heroOverride={heroData} />
}
