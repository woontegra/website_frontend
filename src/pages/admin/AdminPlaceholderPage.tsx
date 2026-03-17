import { useParams } from 'react-router-dom'
import { Card } from '../../components/ui/Card'

const titles: Record<string, string> = {
  musteriler: 'Müşteriler',
  teklifler: 'Teklifler',
  projeler: 'Projeler',
  icerikler: 'İçerikler',
  blog: 'Blog',
  'iletisim-formlari': 'İletişim Formları',
  'mail-bildirimleri': 'Mail Bildirimleri',
  ayarlar: 'Ayarlar',
}

export function AdminPlaceholderPage() {
  const { section } = useParams<{ section: string }>()
  const title = section ? titles[section] ?? 'Sayfa' : 'Sayfa'

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">{title}</h1>
      <Card className="p-6">
        <p className="text-surface-500">Bu bölüm backend ve yetkilendirme bağlandığında doldurulacak.</p>
      </Card>
    </div>
  )
}
