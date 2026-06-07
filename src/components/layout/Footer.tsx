import { Link } from 'react-router-dom'
import { footerNav } from '../../data/navigation'
import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'
import {
  HEADER_LOGO_ALT,
  HEADER_LOGO_HEIGHT,
  HEADER_LOGO_SRC,
  HEADER_LOGO_WIDTH,
} from '../../config/siteLogo'

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-gray-200">
      <div className={`${LAYOUT_CONTAINER_CLASS} py-16 md:py-20`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block" aria-label="Woontegra Ana Sayfa">
              <img
                src={HEADER_LOGO_SRC}
                alt={HEADER_LOGO_ALT}
                width={HEADER_LOGO_WIDTH}
                height={HEADER_LOGO_HEIGHT}
                className="block h-16 w-[180px] max-w-full object-contain object-left md:h-20"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </Link>
            <p className="mt-5 text-slate-500 text-sm max-w-xs leading-relaxed">
              Yazılım, dijital ticaret ve teknoloji çözümlerinde tek çatı. Modern altyapı, güvenilir üretim.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-5">Hizmetler</h3>
            <ul className="space-y-3">
              {footerNav.hizmetler.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-slate-500 hover:text-slate-800 text-sm transition-colors leading-relaxed">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-5">Şirket</h3>
            <ul className="space-y-3">
              {footerNav.sirket.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-slate-500 hover:text-slate-800 text-sm transition-colors leading-relaxed">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-5">Yasal</h3>
            <ul className="space-y-3">
              {footerNav.yasal.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-slate-500 hover:text-slate-800 text-sm transition-colors leading-relaxed">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Woontegra. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="https://wa.me/90XXXXXXXXXX" className="text-slate-500 hover:text-accent-green text-sm transition-colors" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
