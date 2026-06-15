import { useLocation } from 'react-router-dom'
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
  markalar: 'Markalar',
  ozellikler: 'Özellikler',
  stok: 'Stok',
  sayfalar: 'Sayfalar',
  seo: 'SEO',
}

export function AdminPlaceholderPage() {
  const location = useLocation()
  const segment = location.pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean)[0] ?? ''
  const title = titles[segment] ?? 'Sayfa'

  return (
    <div>
      <h1 className="page-title mb-2">{title}</h1>
      <Card className="p-6">
        <p className="text-slate-600">
          Bu modül bir sonraki fazda tamamlanacak. Mağaza için asıl işlevler Ürünler, Kategoriler, Medya ve Menü
          Yönetimi altında.
        </p>
      </Card>
    </div>
  )
}
