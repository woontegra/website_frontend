import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFooterGroups } from '../../hooks/useFooterGroups'
import { useLegalCompanyInfo } from '../../hooks/useLegalCompanyInfo'
import { resolveFooterContactLinks } from '../../lib/companyContact'
import { openCookiePreferences } from '../../lib/cookieConsent'
import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'
import { SiteLogo } from '../ui/SiteLogo'

export function Footer() {
  const { groups } = useFooterGroups()
  const companyInfo = useLegalCompanyInfo()
  const resolvedGroups = useMemo(
    () => resolveFooterContactLinks(groups, companyInfo),
    [groups, companyInfo],
  )
  const linkGroupCount = resolvedGroups.length

  return (
    <footer className="bg-slate-50 border-t border-gray-200">
      <div className={`${LAYOUT_CONTAINER_CLASS} py-16 md:py-20`}>
        <div
          className={`grid grid-cols-1 gap-10 md:grid-cols-2 ${
            linkGroupCount >= 4 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'
          } lg:gap-14`}
        >
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block" aria-label="Woontegra Ana Sayfa">
              <SiteLogo placement="footer" />
            </Link>
            <p className="mt-5 text-slate-500 text-sm max-w-xs leading-relaxed">
              Yazılım, dijital ticaret ve teknoloji çözümlerinde tek çatı. Modern altyapı, güvenilir üretim.
            </p>
          </div>
          {resolvedGroups.map((group) => (
            <div key={group.id}>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-5">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.id}>
                    {link.action === 'cookie-preferences' ? (
                      <button
                        type="button"
                        onClick={openCookiePreferences}
                        className="text-slate-500 hover:text-slate-800 text-sm transition-colors leading-relaxed text-left"
                      >
                        {link.label}
                      </button>
                    ) : link.href?.startsWith('http') || link.href?.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className="text-slate-500 hover:text-slate-800 text-sm transition-colors leading-relaxed"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href ?? '/'}
                        className="text-slate-500 hover:text-slate-800 text-sm transition-colors leading-relaxed"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Woontegra. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
