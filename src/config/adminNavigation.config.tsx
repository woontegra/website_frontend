import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Boxes,
  CreditCard,
  FileSearch,
  FileText,
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  Link2,
  Package,
  PanelLeft,
  Percent,
  Receipt,
  Search,
  Settings,
  ShoppingBag,
  Tag,
  Warehouse,
} from 'lucide-react'

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  /** Sadece bilgi; tıklanabilir */
  placeholder?: boolean
}

export type AdminNavGroup = {
  id: string
  /** Küçük uppercase gösterim için */
  title: string
  defaultOpen: boolean
  items: AdminNavItem[]
}

export const adminNavigationGroups: AdminNavGroup[] = [
  {
    id: 'genel',
    title: 'Genel',
    defaultOpen: true,
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    id: 'urunler',
    title: 'Ürünler',
    defaultOpen: true,
    items: [
      { label: 'Ürünler', href: '/admin/urunler', icon: Package },
      { label: 'Siparişler', href: '/admin/siparisler', icon: Receipt },
      { label: 'Kategoriler', href: '/admin/kategoriler', icon: FolderTree },
      { label: 'Markalar', href: '/admin/markalar', icon: Tag, placeholder: true },
      { label: 'Özellikler', href: '/admin/ozellikler', icon: Percent, placeholder: true },
      { label: 'Stok', href: '/admin/stok', icon: Warehouse, placeholder: true },
    ],
  },
  {
    id: 'site',
    title: 'Site yönetimi',
    defaultOpen: true,
    items: [
      { label: 'Medya Kütüphanesi', href: '/admin/medya', icon: ImageIcon },
      { label: 'Menü Yönetimi', href: '/admin/menu-yonetimi', icon: Link2 },
      { label: 'Ödeme ayarları', href: '/admin/odeme-ayarlari', icon: CreditCard },
      { label: 'Yasal metinler', href: '/admin/yasal-metinler', icon: FileText },
      { label: 'Sayfalar', href: '/admin/sayfalar', icon: BookOpen, placeholder: true },
      { label: 'SEO', href: '/admin/seo', icon: Search, placeholder: true },
    ],
  },
  {
    id: 'kurumsal',
    title: 'Kurumsal CMS',
    defaultOpen: false,
    items: [
      { label: 'İçerik Düzenle', href: '/admin/icerik-duzenle', icon: PanelLeft },
      { label: 'Sayfa menüleri (CMS)', href: '/admin/menuler', icon: Link2 },
      { label: 'Footer', href: '/admin/footer', icon: LayoutDashboard },
      { label: 'Hizmet kartları', href: '/admin/hizmet-kartlari', icon: ShoppingBag },
      { label: 'Çözüm kartları', href: '/admin/cozum-kartlari', icon: Boxes },
      { label: 'Ücretsiz araç kartları', href: '/admin/ucretsiz-arac-kartlari', icon: Package },
      { label: 'Blog yazıları', href: '/admin/blog-yazilari', icon: BookOpen },
      { label: 'Teklifler', href: '/admin/teklifler', icon: FileSearch },
      { label: 'Mesajlar', href: '/admin/mesajlar', icon: PanelLeft },
      { label: 'Yasal sayfalar', href: '/admin/yasal-sayfalar', icon: BookOpen },
      { label: 'Firma bilgileri', href: '/admin/firma-bilgileri', icon: Settings },
      { label: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
    ],
  },
]
