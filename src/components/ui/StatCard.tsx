interface StatCardProps {
  value: string
  label: string
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold bg-gradient-brand bg-clip-text text-transparent">
        {value}
      </div>
      <p className="mt-2 text-surface-600">{label}</p>
    </div>
  )
}
