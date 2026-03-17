interface EmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  title = 'Henüz veri yok',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <p className="text-lg font-medium text-heading">{title}</p>
      {description && <p className="mt-2 text-surface-600 text-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
