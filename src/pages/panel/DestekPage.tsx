import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export function DestekPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Destek Taleplerim</h1>
      <Card className="p-6">
        <p className="text-surface-500 mb-4">Açık destek talepleriniz burada listelenecek.</p>
        <Button variant="secondary" size="sm">Yeni talep oluştur</Button>
      </Card>
    </div>
  )
}
