import { ServiceDetailLayout } from '../components/services/ServiceDetailLayout'
import { trademarkPatentDetail } from '../data/serviceDetailContent'
import { defaultTrademarkData } from '../data/allPagesData'
import { useHeroSection } from '../hooks/useHeroSection'

export function TrademarkPatentPage() {
  const { heroData } = useHeroSection('trademark', defaultTrademarkData)
  return <ServiceDetailLayout content={trademarkPatentDetail} heroOverride={heroData} />
}
