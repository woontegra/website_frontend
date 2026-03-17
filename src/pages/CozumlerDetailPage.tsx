import { useParams, Link } from 'react-router-dom'
import { subBrands } from '../data/subBrands'
import { CTA } from '../components/ui/CTA'

export function CozumlerDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const item = subBrands.find((b) => b.href === `/cozumler/${slug}`)

  if (!item) {
    return (
      <div className="py-16 text-center">
        <p className="text-surface-600">Çözüm bulunamadı.</p>
        <Link to="/cozumler" className="mt-4 inline-block text-accent-blue">← Çözümlere dön</Link>
      </div>
    )
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-heading">{item.name}</h1>
        <p className="mt-6 text-xl text-surface-600">{item.description}</p>
        <CTA
          title="Daha fazla bilgi veya teklif almak ister misiniz?"
          primaryAction={{ label: 'İletişim', href: '/iletisim' }}
          secondaryAction={{ label: 'Teklif Al', href: '/teklif-al' }}
        />
      </div>
    </div>
  )
}
