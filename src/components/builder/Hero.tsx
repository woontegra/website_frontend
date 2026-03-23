import { useNode } from '@craftjs/core'
import { HeroSettings } from './settings/HeroSettings'
import { Button } from '../ui/Button'

export interface HeroProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundImage?: string
}

export const Hero = ({
  title = 'Hoş Geldiniz',
  subtitle = 'Modern çözümlerle geleceği inşa ediyoruz',
  buttonText = 'Başlayın',
  buttonLink = '#',
  backgroundImage = '',
}: HeroProps) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref))
      }}
      className="relative py-24 px-4"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-green-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.15),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{title}</h1>
          <p className="text-xl text-gray-300 mb-8">{subtitle}</p>
          <Button variant="green" size="xl" to={buttonLink}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

Hero.craft = {
  displayName: 'Hero',
  props: {
    title: 'Hoş Geldiniz',
    subtitle: 'Modern çözümlerle geleceği inşa ediyoruz',
    buttonText: 'Başlayın',
    buttonLink: '#',
    backgroundImage: '',
  },
  related: {
    settings: HeroSettings,
  },
}
