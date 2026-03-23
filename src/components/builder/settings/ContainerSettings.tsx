import { useNode } from '@craftjs/core'

export const ContainerSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Arka Plan Rengi</label>
        <input
          type="color"
          value={props.background}
          onChange={(e) => setProp((props: any) => (props.background = e.target.value))}
          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Padding (px)</label>
        <input
          type="number"
          value={props.padding}
          onChange={(e) => setProp((props: any) => (props.padding = parseInt(e.target.value)))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
    </div>
  )
}
