import { Wrench } from 'lucide-react'

export function MaintenancePage() {
  const message = localStorage.getItem('woontegra_maintenance_message') || 'Site bakımda. Kısa süre sonra geri döneceğiz.'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-500/20 rounded-full mb-6">
            <Wrench className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Bakım Çalışması
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <p className="text-gray-400 mb-4">
            Acil durumlar için:
          </p>
          <a 
            href="mailto:info@woontegra.com" 
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            info@woontegra.com
          </a>
        </div>
      </div>
    </div>
  )
}
