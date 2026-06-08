import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  icon: LucideIcon
  title: string
  description: string
}

export function StatCard({ icon: Icon, title, description }: StatCardProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <h3 className="font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  )
}
