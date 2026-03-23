import { useNode } from '@craftjs/core'
import { TextSettings } from './settings/TextSettings'

export interface TextProps {
  text?: string
  fontSize?: number
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  fontWeight?: 'normal' | 'bold'
}

export const Text = ({
  text = 'Metin girin',
  fontSize = 16,
  color = '#000000',
  textAlign = 'left',
  fontWeight = 'normal',
}: TextProps) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref))
      }}
      style={{
        fontSize: `${fontSize}px`,
        color,
        textAlign,
        fontWeight,
        padding: '10px',
        minHeight: '40px',
      }}
    >
      {text}
    </div>
  )
}

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Metin girin',
    fontSize: 16,
    color: '#000000',
    textAlign: 'left',
    fontWeight: 'normal',
  },
  related: {
    settings: TextSettings,
  },
}
