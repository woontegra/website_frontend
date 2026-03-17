import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-heading placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/panel/giris')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="Woontegra" className="h-12 mx-auto" />
          </Link>
          <p className="mt-2 text-surface-600">Yeni hesap oluşturun</p>
        </div>
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-heading mb-1">Ad Soyad</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-heading mb-1">E-posta</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-heading mb-1">Şifre</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
            </div>
            <Button type="submit" className="w-full">Kayıt Ol</Button>
          </form>
          <p className="mt-4 text-center text-sm text-surface-600">
            Zaten hesabınız var mı? <Link to="/panel/giris" className="text-accent-blue hover:underline">Giriş yapın</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
