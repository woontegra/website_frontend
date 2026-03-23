import { useNode } from '@craftjs/core'
import type { ReactNode } from 'react'
import { ContainerSettings } from './settings/ContainerSettings'

export interface ContainerProps {
  background?: string
  padding?: number
  children?: ReactNode
}

export const Container = ({ background = '#ffffff', padding = 20, children }: ContainerProps) => {
  const {
    connectors: { connect, drag },
  } = useNode()

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref))
      }}
      style={{
        background,
        padding: `${padding}px`,
        minHeight: '100px',
      }}
    >
      {children}
    </div>
  )
}

Container.craft = {
  displayName: 'Container',
  props: {
    background: '#ffffff',
    padding: 20,
  },
  related: {
    settings: ContainerSettings,
  },
}
