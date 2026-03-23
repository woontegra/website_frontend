import { useNode } from '@craftjs/core'

export const ImageSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Görsel URL</label>
        <input
          type="text"
          value={props.src}
          onChange={(e) => setProp((props: any) => (props.src = e.target.value))}
          placeholder="/images/example.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
        {props.src && (
          <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <img src={props.src} alt="Preview" className="max-h-32 mx-auto rounded" />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Alt Metin</label>
        <input
          type="text"
          value={props.alt}
          onChange={(e) => setProp((props: any) => (props.alt = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Genişlik</label>
        <input
          type="text"
          value={props.width}
          onChange={(e) => setProp((props: any) => (props.width = e.target.value))}
          placeholder="100%"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Yükseklik</label>
        <input
          type="text"
          value={props.height}
          onChange={(e) => setProp((props: any) => (props.height = e.target.value))}
          placeholder="auto"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Object Fit</label>
        <select
          value={props.objectFit}
          onChange={(e) => setProp((props: any) => (props.objectFit = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
        </select>
      </div>
    </div>
  )
}
