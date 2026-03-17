import { Card } from '../../components/ui/Card'

export function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Aktif projeler', value: '2' },
          { label: 'Bekleyen teklifler', value: '1' },
          { label: 'Açık destek talepleri', value: '0' },
          { label: 'Son fatura', value: '—' },
        ].map((s) => (
          <Card key={s.label} className="p-6">
            <p className="text-surface-600 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-heading mt-1">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-heading mb-4">Son aktiviteler</h2>
        <p className="text-surface-500 text-sm">Henüz aktivite yok. Projeler ve teklifler burada listelenecek.</p>
      </Card>
    </div>
  )
}
