import { useNode } from '@craftjs/core'

export const HeroSettings = () => {
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
        <textarea
          value={props.subtitle}
          onChange={(e) => setProp((props: any) => (props.subtitle = e.target.value))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Buton Metni</label>
        <input
          type="text"
          value={props.buttonText}
          onChange={(e) => setProp((props: any) => (props.buttonText = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Buton Linki</label>
        <input
          type="text"
          value={props.buttonLink}
          onChange={(e) => setProp((props: any) => (props.buttonLink = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Arka Plan Görseli</label>
        <input
          type="text"
          value={props.backgroundImage}
          onChange={(e) => setProp((props: any) => (props.backgroundImage = e.target.value))}
          placeholder="/images/hero.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
    </div>
  )
}
