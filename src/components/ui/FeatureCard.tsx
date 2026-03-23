import { Card } from './Card'

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="p-5 md:p-6">
      {icon && (
        <div className="mb-4 [&>svg]:text-accent-blue [&>.icon-green]:text-accent-green">{icon}</div>
      )}
      <h3 className="text-base font-semibold leading-snug text-slate-900 md:text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </Card>
  )
}
