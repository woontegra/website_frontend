import { Editor, Frame, Element } from '@craftjs/core'
import { Container } from './Container'
import { Hero } from './Hero'
import { Text } from './Text'
import { Image } from './Image'
import { Services } from './Services'
import { Contact } from './Contact'
import { CTA } from './CTA'
import { Brands } from './Brands'

interface PageRendererProps {
  json: string
}

export const PageRenderer = ({ json }: PageRendererProps) => {
  if (!json) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Bu sayfa henüz oluşturulmamış</p>
      </div>
    )
  }

  try {
    const parsedJson = JSON.parse(json)

    return (
      <Editor
        resolver={{
          Container,
          Hero,
          Text,
          Image,
          Services,
          Contact,
          CTA,
          Brands,
        }}
        enabled={false}
      >
        <Frame json={parsedJson}>
          <Element is={Container} canvas />
        </Frame>
      </Editor>
    )
  } catch (e) {
    console.error('Failed to parse page JSON:', e)
    return (
      <div className="text-center py-20 text-red-500">
        <p>Sayfa yüklenirken hata oluştu</p>
      </div>
    )
  }
}
