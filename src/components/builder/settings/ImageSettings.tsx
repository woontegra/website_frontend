import { useNode } from '@craftjs/core'
import { ManagedImageField } from '../../admin/ManagedImageField'

export const ImageSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4">
      <ManagedImageField
        label="Görsel"
        value={props.src ?? ''}
        onChange={(url) => setProp((p: { src: string }) => (p.src = url))}
      />
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
