import type { LucideIcon } from 'lucide-react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type SettingsCollapsibleSectionProps = {
  id: string
  icon: LucideIcon
  title: string
  isOpen: boolean
  onToggle: (id: string) => void
  children: React.ReactNode
}

/**
 * Ayarlar sayfası accordion bölümü — bileşen dosya düzeyinde tanımlıdır;
 * parent state güncellenince (ör. token yapıştırma) tüm sayfa remount olmaz.
 */
export function SettingsCollapsibleSection({
  id,
  icon: Icon,
  title,
  isOpen,
  onToggle,
  children,
}: SettingsCollapsibleSectionProps) {
  return (
    <div className="card">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between rounded-lg p-4 transition-colors hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-green-600" />
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>
      {isOpen ? <div className="compact-space-y p-4 pt-0">{children}</div> : null}
    </div>
  )
}
