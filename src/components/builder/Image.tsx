import { useNode } from '@craftjs/core'
import { ImageSettings } from './settings/ImageSettings'
import { SafeImage } from '../ui/SafeImage'
import { siteImages } from '../../data/siteImages'

export interface ImageProps {
  src?: string
  alt?: string
  width?: string
  height?: string
  objectFit?: 'cover' | 'contain' | 'fill'
}

export const Image = ({
  src = siteImages.homeHero,
  alt = 'Image',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
}: ImageProps) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref))
      }}
      style={{
        width,
        minHeight: '200px',
        overflow: 'hidden',
      }}
    >
      <SafeImage
        src={src}
        alt={alt}
        className="w-full"
        style={{
          width: '100%',
          height,
          objectFit,
        }}
      />
    </div>
  )
}

Image.craft = {
  displayName: 'Image',
  props: {
    src: siteImages.homeHero,
    alt: 'Image',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
  },
  related: {
    settings: ImageSettings,
  },
}
