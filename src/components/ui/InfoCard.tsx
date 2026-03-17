import { Card } from './Card'

interface InfoCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function InfoCard({ title, children, className = '' }: InfoCardProps) {
  return (
    <Card className={`p-6 ${className}`} hover={false}>
      <h3 className="font-semibold text-heading mb-2">{title}</h3>
      {children}
    </Card>
  )
}
