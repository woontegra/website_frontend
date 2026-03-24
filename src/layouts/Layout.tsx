import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { MaintenancePage } from '../pages/MaintenancePage'
import { SURFACE_PAGE_ROOT } from '../lib/sectionSurfaces'

export { LAYOUT_CONTAINER_CLASS } from '../lib/layoutConstants'

type LayoutProps = {
  /** Router dışı (ör. builder önizleme): Outlet yerine doğrudan içerik */
  children?: React.ReactNode
}

/**
 * Tek site layout’u — public sayfalar ve builder önizleme aynı bileşeni kullanır.
 * Ekstra scale/padding burada yok; sayfa gövdesi `main` içinde.
 */
export function Layout({ children }: LayoutProps) {
  // Check maintenance mode from localStorage
  const maintenanceMode = localStorage.getItem('woontegra_maintenance_mode') === 'true'
  
  if (maintenanceMode) {
    return <MaintenancePage />
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className={`w-full flex-1 ${SURFACE_PAGE_ROOT}`}>{children ?? <Outlet />}</main>
      <Footer />
    </div>
  )
}
