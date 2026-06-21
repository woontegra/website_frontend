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
import { AdminProductsPage } from '../pages/admin/AdminProductsPage'
import { AdminProductFormPage } from '../pages/admin/AdminProductFormPage'
import { AdminMediaLibraryPage } from '../pages/admin/AdminMediaLibraryPage'
import { AdminProductCategoriesPage } from '../pages/admin/AdminProductCategoriesPage'
import { AdminNavigationMenuPage } from '../pages/admin/AdminNavigationMenuPage'
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage'
import { AdminOrderDetailPage } from '../pages/admin/AdminOrderDetailPage'
import { AdminLicensesPage } from '../pages/admin/AdminLicensesPage'
import { AdminLicenseDetailPage } from '../pages/admin/AdminLicenseDetailPage'
import { AdminPaymentSettingsPage } from '../pages/admin/AdminPaymentSettingsPage'
import { AdminLegalDocumentsPage } from '../pages/admin/AdminLegalDocumentsPage'
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
import { LegalCheckoutDocumentPage } from '../pages/legal/LegalCheckoutDocumentPage'
import { UrunlerPage } from '../pages/UrunlerPage'
import { UrunDetailPage } from '../pages/UrunDetailPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { CheckoutSlugRedirect } from '../pages/CheckoutSlugRedirect'
import { CustomerLoginPage } from '../pages/CustomerLoginPage'
import { CustomerRegisterPage } from '../pages/CustomerRegisterPage'
import { SiparisSorgulaPage } from '../pages/SiparisSorgulaPage'
import { HesabimLayout } from '../layouts/HesabimLayout'
import { RequireCustomer } from '../components/store/RequireCustomer'
import { HesabimDashboardPage } from '../pages/HesabimDashboardPage'
import { HesabimOrdersPage } from '../pages/HesabimOrdersPage'
import { HesabimCustomerOrderPage } from '../pages/HesabimCustomerOrderPage'
import { HesabimAddressesPage } from '../pages/HesabimAddressesPage'
import { HesabimAccountDetailsPage } from '../pages/HesabimAccountDetailsPage'
import { HesabimFavoritesPage } from '../pages/HesabimFavoritesPage'
import { SiparislerimPage } from '../pages/SiparislerimPage'
import { SiparisDetayPage } from '../pages/SiparisDetayPage'
import { OrderSuccessPage } from '../pages/OrderSuccessPage'
import { OrderFailPage } from '../pages/OrderFailPage'
import { KategoriPage } from '../pages/KategoriPage'
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
      { path: 'urunler', element: <UrunlerPage /> },
      { path: 'sepet', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/:slug', element: <CheckoutSlugRedirect /> },
      { path: 'giris', element: <CustomerLoginPage /> },
      { path: 'kayit', element: <CustomerRegisterPage /> },
      { path: 'siparis-sorgula', element: <SiparisSorgulaPage /> },
      {
        path: 'hesabim',
        element: <RequireCustomer />,
        children: [
          {
            element: <HesabimLayout />,
            children: [
              { index: true, element: <HesabimDashboardPage /> },
              { path: 'siparisler', element: <HesabimOrdersPage /> },
              { path: 'siparisler/:orderNo', element: <HesabimCustomerOrderPage /> },
              { path: 'adresler', element: <HesabimAddressesPage /> },
              { path: 'hesap-detaylari', element: <HesabimAccountDetailsPage /> },
              { path: 'favoriler', element: <HesabimFavoritesPage /> },
            ],
          },
        ],
      },
      { path: 'siparislerim', element: <SiparislerimPage /> },
      { path: 'siparis/:orderNo', element: <SiparisDetayPage /> },
      { path: 'siparis-basarili', element: <OrderSuccessPage /> },
      { path: 'siparis-basarili/:orderNo', element: <OrderSuccessPage /> },
      { path: 'siparis-basarisiz/:orderNo', element: <OrderFailPage /> },
      { path: 'siparis-basarisiz', element: <OrderFailPage /> },
      { path: 'urun/:slug', element: <UrunDetailPage /> },
      { path: 'kategori/:slug', element: <KategoriPage /> },
      { path: 'kvkk-aydinlatma-metni', element: <KvkkAydinlatmaPage /> },
      { path: 'gizlilik-politikasi', element: <GizlilikPolitikasiPage /> },
      { path: 'cerez-politikasi', element: <CookiePolicyPage /> },
      { path: 'acik-riza-metni', element: <AcikRizaMetniPage /> },
      { path: 'kullanim-sartlari', element: <KullanimSartlariPage /> },
      { path: 'yasal/:docSlug', element: <LegalCheckoutDocumentPage /> },
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
              { path: 'sayfalar/:pageId', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'sayfalar', element: <AdminPlaceholderPage /> },
              { path: 'yazilar', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'yazilar/:postId', element: <Navigate to="/admin/icerik-duzenle" replace /> },
              { path: 'kategoriler', element: <AdminProductCategoriesPage /> },
              { path: 'medya', element: <AdminMediaLibraryPage /> },
              { path: 'menu-yonetimi', element: <AdminNavigationMenuPage /> },
              { path: 'markalar', element: <AdminPlaceholderPage /> },
              { path: 'ozellikler', element: <AdminPlaceholderPage /> },
              { path: 'stok', element: <AdminPlaceholderPage /> },
              { path: 'seo', element: <AdminPlaceholderPage /> },
              { path: 'menuler', element: <AdminMenuPage /> },
              { path: 'footer', element: <AdminFooterPage /> },
              { path: 'hizmet-kartlari', element: <AdminServiceCardsPage /> },
              { path: 'cozum-kartlari', element: <AdminSolutionCardsPage /> },
              { path: 'ucretsiz-arac-kartlari', element: <AdminFreeToolCardsPage /> },
              { path: 'mesajlar', element: <AdminMessagesPage /> },
              { path: 'teklifler', element: <AdminQuotesPage /> },
              { path: 'icerik-duzenle', element: <AdminContentEditPage /> },
              { path: 'blog-yazilari', element: <AdminBlogPostsPage /> },
              { path: 'urunler', element: <AdminProductsPage /> },
              { path: 'urunler/yeni', element: <AdminProductFormPage /> },
              { path: 'urunler/:id', element: <AdminProductFormPage /> },
              { path: 'siparisler', element: <AdminOrdersPage /> },
              { path: 'siparisler/:id', element: <AdminOrderDetailPage /> },
              { path: 'lisanslar', element: <AdminLicensesPage /> },
              { path: 'lisanslar/:id', element: <AdminLicenseDetailPage /> },
              { path: 'odeme-ayarlari', element: <AdminPaymentSettingsPage /> },
              { path: 'yasal-metinler', element: <AdminLegalDocumentsPage /> },
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
