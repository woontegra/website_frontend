import { Editor, Frame, Element } from '@craftjs/core'
import { Container } from '../../components/builder/Container'
import { Text } from '../../components/builder/Text'

export function TestBuilderPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Builder Test</h1>
      <div className="border-2 border-blue-500 p-4">
        <Editor
          resolver={{
            Container,
            Text,
          }}
        >
          <Frame>
            <Element is={Container} canvas>
              <Element is={Text} text="Test metni - eğer bunu görüyorsanız builder çalışıyor!" />
            </Element>
          </Frame>
        </Editor>
      </div>
    </div>
  )
}
