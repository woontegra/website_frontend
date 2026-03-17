# Woontegra Kurumsal Web Sitesi (Frontend)

Tüm komutlar bu klasörden (`frontend`) çalıştırılır.

## Çalıştırma

```bash
npm install
npm run dev
```

Build: `npm run build`  
Önizleme: `npm run preview`

## Özellikler

- **Anasayfa**: Hero, güven alanı, hizmet kartları, alt markalar, neden Woontegra, süreç, istatistikler, CTA
- **Sayfalar**: Hakkımızda, Hizmetler, Hizmet detay şablonları, Çözümler, Bilirkişi Hesaplama, Marka & Patent, E-Ticaret, Oyun, Blog, İletişim, Teklif Al, SSS
- **Yasal**: KVKK, Gizlilik, Çerez Politikası, Kullanım Şartları
- **Kullanıcı paneli**: Giriş, Kayıt, Şifremi Unuttum, Dashboard, Profil, Projeler, Teklifler, Destek, Faturalar, Bildirimler, Ayarlar
- **Admin paneli (iskelet)**: Genel bakış, Müşteriler, Teklifler, Projeler, İçerikler, Blog, İletişim formları, Mail bildirimleri, Ayarlar

## Proje yapısı

- `src/components/ui` – Button, Card, SectionHeader, Badge, CTA
- `src/components/layout` – Navbar, Footer
- `src/components/sections` – Hero, TrustBlock, ServiceCards, SubBrandsSection, WhyWoontegra, ProcessSection, StatsSection
- `src/layouts` – MainLayout, PanelLayout, AdminLayout
- `src/pages` – Tüm sayfa bileşenleri
- `src/data` – navigation, services, subBrands, blog, faq
- `src/routes` – React Router tanımları

Teknoloji: React 19, TypeScript, Vite, Tailwind CSS, React Router.
