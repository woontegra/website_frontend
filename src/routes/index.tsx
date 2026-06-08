import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import { Layout } from '../layouts/Layout'
import { PanelLayout } from '../layouts/PanelLayout'
import { DynamicPage } from '../pages/DynamicPage'
import { HomePage } from '../pages/HomePage'
import { AboutPage } from '../pages/AboutPage'
import { ContactPage } from '../pages/ContactPage'
import { LoginPage } from '../pages/panel/LoginPage'
import { RegisterPage } from '../pages/panel/RegisterPage'
import { ForgotPasswordPage } from '../pages/panel/ForgotPasswordPage'
import { DashboardPage } from '../pages/panel/DashboardPage'
import { ProfilPage } from '../pages/panel/ProfilPage'
import { ProjelerPage } from '../pages/panel/ProjelerPage'
import { TekliflerPage } from '../pages/panel/TekliflerPage'
import { DestekPage } from '../pages/panel/DestekPage'
import { FaturalarPage } from '../pages/panel/FaturalarPage'
import { BildirimlerPage } from '../pages/panel/BildirimlerPage'
import { AyarlarPage } from '../pages/panel/AyarlarPage'
import { AdminLayout } from '../layouts/AdminLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminPlaceholderPage } from '../pages/admin/AdminPlaceholderPage'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AdminMessagesPage } from '../pages/admin/AdminMessagesPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { AdminQuotesPage } from '../pages/admin/AdminQuotesPage'
import { AdminContentEditPage } from '../pages/admin/AdminContentEditPage'
import { AdminMenuPage } from '../pages/admin/AdminMenuPage'
import { AdminFooterPage } from '../pages/admin/AdminFooterPage'
import { AdminServiceCardsPage } from '../pages/admin/AdminServiceCardsPage'
import { AdminSolutionCardsPage } from '../pages/admin/AdminSolutionCardsPage'
import { AdminFreeToolCardsPage } from '../pages/admin/AdminFreeToolCardsPage'
import { AdminLegalPagesPage } from '../pages/admin/AdminLegalPagesPage'
import { AdminCompanyInfoPage } from '../pages/admin/AdminCompanyInfoPage'
import { AdminBlogPostsPage } from '../pages/admin/AdminBlogPostsPage'
import { SoftwareDevelopmentPage } from '../pages/SoftwareDevelopmentPage'
import { WebDesignPage } from '../pages/WebDesignPage'
import { EcommercePage } from '../pages/EcommercePage'
import { SaasProductPage } from '../pages/SaasProductPage'
import { TrademarkPatentPage } from '../pages/TrademarkPatentPage'
import { GameDevelopmentPage } from '../pages/GameDevelopmentPage'
import { DigitalConsultingPage } from '../pages/DigitalConsultingPage'
import { SolutionsPage } from '../pages/SolutionsPage'
import { BlogPage } from '../pages/BlogPage'
import { BlogPostDetailPage } from '../pages/BlogPostDetailPage'
import { FaqPage } from '../pages/FAQPage'
import { QuotePage } from '../pages/QuotePage'
import { TestPage } from '../pages/TestPage'
import { SifreKasasiPage } from '../pages/SifreKasasiPage'
import { ServicesPage } from '../pages/ServicesPage'
import { UcretsizAraclarPage } from '../pages/UcretsizAraclarPage'
import { CookiePolicyPage } from '../pages/legal/CookiePolicyPage'
import { KvkkAydinlatmaPage } from '../pages/legal/KvkkAydinlatmaPage'
import { GizlilikPolitikasiPage } from '../pages/legal/GizlilikPolitikasiPage'
import { AcikRizaMetniPage } from '../pages/legal/AcikRizaMetniPage'
import { KullanimSartlariPage } from '../pages/legal/KullanimSartlariPage'
import { RequireAdmin } from '../components/admin/RequireAdmin'

function CmsSlugRoute() {
  const { slug } = useParams<{ slug: string }>()
  return slug ? <DynamicPage slug={slug} /> : null
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'test', element: <TestPage /> },
      { path: 'hakkimizda', element: <AboutPage /> },
      { path: 'iletisim', element: <ContactPage /> },
      { path: 'sss', element: <FaqPage /> },
      { path: 'teklif-al', element: <QuotePage /> },
      { path: 'hizmetler', element: <ServicesPage /> },
      { path: 'hizmetler/yazilim-gelistirme', element: <SoftwareDevelopmentPage /> },
      { path: 'hizmetler/web-tasarim', element: <WebDesignPage /> },
      { path: 'hizmetler/e-ticaret', element: <EcommercePage /> },
      { path: 'hizmetler/saas', element: <SaasProductPage /> },
      { path: 'hizmetler/marka-patent-vekilligi', element: <TrademarkPatentPage /> },
      { path: 'hizmetler/oyun-gelistirme', element: <GameDevelopmentPage /> },
      { path: 'hizmetler/dijital-danismanlik', element: <DigitalConsultingPage /> },
      { path: 'cozumler', element: <SolutionsPage /> },
      { path: 'blog/:slug', element: <BlogPostDetailPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'hizmetler/:slug', element: <ServiceDetailRoute /> },
      { path: 'cozumler/bilirkisi-hesaplama', element: <DynamicPage slug="bilirkisi-hesaplama" /> },
      { path: 'cozumler/:slug', element: <CozumDetailRoute /> },
      { path: 'ucretsiz-araclar/sifre-kasasi', element: <SifreKasasiPage /> },
      { path: 'ucretsiz-araclar', element: <UcretsizAraclarPage /> },
      { path: 'kvkk-aydinlatma-metni', element: <KvkkAydinlatmaPage /> },
      { path: 'gizlilik-politikasi', element: <GizlilikPolitikasiPage /> },
      { path: 'cerez-politikasi', element: <CookiePolicyPage /> },
      { path: 'acik-riza-metni', element: <AcikRizaMetniPage /> },
      { path: 'kullanim-sartlari', element: <KullanimSartlariPage /> },
      { path: 'kvkk', element: <Navigate to="/kvkk-aydinlatma-metni" replace /> },
      { path: 'gizlilik', element: <Navigate to="/gizlilik-politikasi" replace /> },
      { path: ':slug', element: <CmsSlugRoute /> },
    ],
  },
  {
    path: '/panel',
    children: [
      { path: 'giris', element: <LoginPage /> },
      { path: 'kayit', element: <RegisterPage /> },
      { path: 'sifremi-unuttum', element: <ForgotPasswordPage /> },
      {
        element: <PanelLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'profil', element: <ProfilPage /> },
          { path: 'projeler', element: <ProjelerPage /> },
          { path: 'teklifler', element: <TekliflerPage /> },
          { path: 'destek', element: <DestekPage /> },
          { path: 'faturalar', element: <FaturalarPage /> },
          { path: 'bildirimler', element: <BildirimlerPage /> },
          { path: 'ayarlar', element: <AyarlarPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin/sayfalar/:pageId/edit',
    element: <Navigate to="/admin/icerik-duzenle" replace />,
  },
  {
    path: '/admin',
    children: [
      { path: 'giris', element: <AdminLoginPage /> },
      {
        element: <RequireAdmin />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: 'sayfalar', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'sayfalar/:pageId', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'yazilar', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'yazilar/:postId', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'kategoriler', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'menuler', element: <AdminMenuPage /> },
              { path: 'footer', element: <AdminFooterPage /> },
              { path: 'hizmet-kartlari', element: <AdminServiceCardsPage /> },
              { path: 'cozum-kartlari', element: <AdminSolutionCardsPage /> },
              { path: 'ucretsiz-arac-kartlari', element: <AdminFreeToolCardsPage /> },
              { path: 'medya', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'hizmetler', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'markalar', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'mesajlar', element: <AdminMessagesPage /> },
              { path: 'teklifler', element: <AdminQuotesPage /> },
              { path: 'icerik-duzenle', element: <AdminContentEditPage /> },
              { path: 'blog-yazilari', element: <AdminBlogPostsPage /> },
              { path: 'yasal-sayfalar', element: <AdminLegalPagesPage /> },
              { path: 'firma-bilgileri', element: <AdminCompanyInfoPage /> },
              { path: 'ayarlar', element: <AdminSettingsPage /> },
              { path: 'test-builder', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'cms', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'pages/:pageId/builder', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'cms/:pageId/builder', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: ':section', element: <AdminPlaceholderPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

function ServiceDetailRoute() {
  const { slug } = useParams<{ slug: string }>()
  return slug ? <DynamicPage slug={slug} /> : null
}

function CozumDetailRoute() {
  const { slug } = useParams<{ slug: string }>()
  return slug ? <DynamicPage slug={slug} /> : null
}
