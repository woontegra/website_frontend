import { useNode } from '@craftjs/core'
import { CTASettings } from './settings/CTASettings'
import { Button } from '../ui/Button'
import { ArrowRight } from 'lucide-react'

export interface CTAProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundImage?: string
}

export const CTA = ({
  title = 'Projenizi Hayata Geçirmeye Hazır mısınız?',
  subtitle = 'Uzman ekibimizle tanışın ve dijital dönüşüm yolculuğunuza bugün başlayın',
  buttonText = 'Ücretsiz Görüşme Talep Edin',
  buttonLink = '/iletisim',
  backgroundImage = '/images/cta-bg.jpg',
}: CTAProps) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref))
      }}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/80" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <Button variant="green" size="xl" to={buttonLink} className="group">
          {buttonText}
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}

CTA.craft = {
  displayName: 'CTA',
  props: {
    title: 'Projenizi Hayata Geçirmeye Hazır mısınız?',
    subtitle: 'Uzman ekibimizle tanışın ve dijital dönüşüm yolculuğunuza bugün başlayın',
    buttonText: 'Ücretsiz Görüşme Talep Edin',
    buttonLink: '/iletisim',
    backgroundImage: '/images/cta-bg.jpg',
  },
  related: {
    settings: CTASettings,
  },
}
