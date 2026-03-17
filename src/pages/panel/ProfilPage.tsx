import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export function ProfilPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Profilim</h1>
      <Card className="p-6 max-w-xl">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Ad Soyad</label>
            <input type="text" defaultValue="Kullanıcı Adı" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading focus:outline-none focus:ring-2 focus:ring-accent-blue/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">E-posta</label>
            <input type="email" defaultValue="ornek@email.com" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading focus:outline-none focus:ring-2 focus:ring-accent-blue/30" />
          </div>
          <Button type="submit">Kaydet</Button>
        </form>
      </Card>
    </div>
  )
}
