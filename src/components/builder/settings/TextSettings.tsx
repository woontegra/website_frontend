import { useNode } from '@craftjs/core'

export const TextSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Metin</label>
        <textarea
          value={props.text}
          onChange={(e) => setProp((props: any) => (props.text = e.target.value))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Font Boyutu</label>
        <input
          type="number"
          value={props.fontSize}
          onChange={(e) => setProp((props: any) => (props.fontSize = parseInt(e.target.value)))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Renk</label>
        <input
          type="color"
          value={props.color}
          onChange={(e) => setProp((props: any) => (props.color = e.target.value))}
          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Hizalama</label>
        <select
          value={props.textAlign}
          onChange={(e) => setProp((props: any) => (props.textAlign = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        >
          <option value="left">Sol</option>
          <option value="center">Orta</option>
          <option value="right">Sağ</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Kalınlık</label>
        <select
          value={props.fontWeight}
          onChange={(e) => setProp((props: any) => (props.fontWeight = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        >
          <option value="normal">Normal</option>
          <option value="bold">Kalın</option>
        </select>
      </div>
    </div>
  )
}
