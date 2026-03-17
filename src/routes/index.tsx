import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { PanelLayout } from '../layouts/PanelLayout'
import { DynamicPage } from '../pages/DynamicPage'
import { BlogPostPage } from '../pages/BlogPostPage'
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
import { AdminCmsPagesPage } from '../pages/admin/AdminCmsPagesPage'
import { AdminCmsPageEditor } from '../pages/admin/AdminCmsPageEditor'

function Page({ slug }: { slug: string }) {
  return <DynamicPage slug={slug} />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Page slug="home" /> },
      { path: 'hakkimizda', element: <Page slug="hakkimizda" /> },
      { path: 'hizmetler', element: <Page slug="hizmetler" /> },
      { path: 'hizmetler/:slug', element: <ServiceDetailRoute /> },
      { path: 'cozumler', element: <Page slug="cozumler" /> },
      { path: 'cozumler/bilirkisi-hesaplama', element: <Page slug="bilirkisi-hesaplama" /> },
      { path: 'cozumler/:slug', element: <CozumDetailRoute /> },
      { path: 'marka-patent', element: <Page slug="marka-patent" /> },
      { path: 'e-ticaret', element: <Page slug="eticaret" /> },
      { path: 'oyun-ve-dijital-urunler', element: <Page slug="oyun-ve-dijital-urunler" /> },
      { path: 'blog', element: <Page slug="blog" /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'iletisim', element: <Page slug="iletisim" /> },
      { path: 'teklif-al', element: <Page slug="teklif-al" /> },
      { path: 'sss', element: <Page slug="sss" /> },
      { path: 'kvkk', element: <Page slug="kvkk" /> },
      { path: 'gizlilik', element: <Page slug="gizlilik" /> },
      { path: 'cerez-politikasi', element: <Page slug="cerez-politikasi" /> },
      { path: 'kullanim-sartlari', element: <Page slug="kullanim-sartlari" /> },
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
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'cms', element: <AdminCmsPagesPage /> },
      { path: 'cms/:id', element: <AdminCmsPageEditor /> },
      { path: ':section', element: <AdminPlaceholderPage /> },
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
