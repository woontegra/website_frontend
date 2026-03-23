import { Element, useEditor } from '@craftjs/core'
import { Container } from './Container'
import { Hero } from './Hero'
import { Text } from './Text'
import { Image } from './Image'
import { Services } from './Services'
import { Contact } from './Contact'
import { CTA } from './CTA'
import { Brands } from './Brands'
import { Plus } from 'lucide-react'

export const Toolbox = () => {
  const { connectors } = useEditor()

  const components = [
    { name: 'Container', component: Container, icon: '📦' },
    { name: 'Hero', component: Hero, icon: '🎯' },
    { name: 'Text', component: Text, icon: '📝' },
    { name: 'Image', component: Image, icon: '🖼️' },
    { name: 'Services', component: Services, icon: '⚙️' },
    { name: 'Brands', component: Brands, icon: '🏢' },
    { name: 'Contact', component: Contact, icon: '📧' },
    { name: 'CTA', component: CTA, icon: '🎬' },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Componentler</h3>
      <div className="space-y-2">
        {components.map((item) => (
          <div
            key={item.name}
            ref={(ref) => {
              if (ref) {
                connectors.create(
                  ref,
                  <Element is={item.component} canvas={item.name === 'Container'} />
                )
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-green-50 border border-gray-200 hover:border-green-500 rounded-xl transition-colors cursor-move group"
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
            </div>
            <Plus className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs text-blue-900 font-medium">
          💡 Componentleri sürükleyip canvas'a bırakın
        </p>
      </div>
    </div>
  )
}
