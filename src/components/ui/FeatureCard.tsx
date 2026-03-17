import { Card } from './Card'

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="p-6 md:p-8">
      {icon && <div className="mb-5 [&>svg]:text-accent-blue [&>.icon-green]:text-accent-green">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600 text-sm leading-relaxed">{description}</p>
    </Card>
  )
}
