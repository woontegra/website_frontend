import { Card } from '../../components/ui/Card'

export function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Genel Bakış</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Müşteriler', value: '—' },
          { label: 'Açık teklifler', value: '—' },
          { label: 'Aktif projeler', value: '—' },
          { label: 'İletişim talepleri', value: '—' },
        ].map((s) => (
          <Card key={s.label} className="p-6">
            <p className="text-surface-600 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-heading mt-1">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <p className="text-surface-500">Admin paneli iskeleti. Backend ve auth bağlandığında veriler burada listelenecek.</p>
      </Card>
    </div>
  )
}
