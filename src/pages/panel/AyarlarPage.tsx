import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export function AyarlarPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Ayarlar</h1>
      <Card className="p-6 max-w-xl">
        <h2 className="text-lg font-semibold text-heading mb-4">Şifre değiştir</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Mevcut şifre</label>
            <input type="password" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading focus:outline-none focus:ring-2 focus:ring-accent-blue/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Yeni şifre</label>
            <input type="password" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading focus:outline-none focus:ring-2 focus:ring-accent-blue/30" />
          </div>
          <Button type="submit">Şifreyi güncelle</Button>
        </form>
      </Card>
    </div>
  )
}
