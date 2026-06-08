import { ServiceDetailLayout } from '../components/services/ServiceDetailLayout'
import { gameDevelopmentDetail } from '../data/serviceDetailContent'
import { defaultGameDevData } from '../data/allPagesData'
import { useHeroSection } from '../hooks/useHeroSection'

export function GameDevelopmentPage() {
  const { heroData } = useHeroSection('game-dev', defaultGameDevData)
  return <ServiceDetailLayout content={gameDevelopmentDetail} heroOverride={heroData} />
}
