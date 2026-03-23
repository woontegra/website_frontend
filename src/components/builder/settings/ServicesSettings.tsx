import { useNode } from '@craftjs/core'

export const ServicesSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Başlık</label>
        <input
          type="text"
          value={props.title}
          onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Alt Başlık</label>
        <input
          type="text"
          value={props.subtitle}
          onChange={(e) => setProp((props: any) => (props.subtitle = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 mb-2">Hizmetler</p>
        <p className="text-xs text-gray-600">Hizmetler dinamik olarak yönetilir</p>
      </div>
    </div>
  )
}
