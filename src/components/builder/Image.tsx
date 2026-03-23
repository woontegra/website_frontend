import { useNode } from '@craftjs/core'
import { ImageSettings } from './settings/ImageSettings'

export interface ImageProps {
  src?: string
  alt?: string
  width?: string
  height?: string
  objectFit?: 'cover' | 'contain' | 'fill'
}

export const Image = ({
  src = '/images/hero-dashboard.jpg',
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
      <img
        src={src}
        alt={alt}
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
    src: '/images/hero-dashboard.jpg',
    alt: 'Image',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
  },
  related: {
    settings: ImageSettings,
  },
}
