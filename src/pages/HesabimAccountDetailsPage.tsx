import { useEffect, useState } from 'react'
import { customersApi } from '../api/customers-api'
import { getCustomerToken, saveCustomerSession } from '../lib/customerAuth'

export function HesabimAccountDetailsPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const [phone, setPhone] = useState('')

  const [profileErr, setProfileErr] = useState<string | null>(null)
  const [profileMsg, setProfileMsg] = useState<string | null>(null)
  const [pwdErr, setPwdErr] = useState<string | null>(null)
  const [pwdMsg, setPwdMsg] = useState<string | null>(null)

  const [curPwd, setCurPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [newPwd2, setNewPwd2] = useState('')

  useEffect(() => {
    void (async () => {
      try {
        const me = await customersApi.getMe()
        const parts = me.name.trim().split(/\s+/)
        setFirstName(parts[0] ?? '')
        setLastName(parts.slice(1).join(' '))
        setEmail(me.email)
        setPhone(me.phone ?? '')
      } catch {
        setProfileErr('Profil yüklenemedi.')
      }
    })()
  }, [])

  useEffect(() => {
    const msg = profileMsg || pwdMsg
    if (!msg) return
    const t = window.setTimeout(() => {
      setProfileMsg(null)
      setPwdMsg(null)
    }, 4500)
    return () => window.clearTimeout(t)
  }, [profileMsg, pwdMsg])

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileErr(null)
    setProfileMsg(null)
    setPwdErr(null)
    setPwdMsg(null)
    try {
      const full = `${firstName.trim()} ${lastName.trim()}`.trim()
      if (!full) {
        setProfileErr('Ad veya soyad zorunludur.')
        return
      }
      const updated = await customersApi.patchMe({
        name: full,
        phone: phone.trim() || null,
      })
      const t = getCustomerToken()
      if (t && updated) {
        saveCustomerSession(t, updated)
      }
      const parts = updated.name.trim().split(/\s+/)
      setFirstName(parts[0] ?? '')
      setLastName(parts.slice(1).join(' '))
      setProfileMsg('Hesap bilgileriniz kaydedildi.')
    } catch (e) {
      setProfileErr(e instanceof Error ? e.message : 'Güncellenemedi')
    }
  }

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdErr(null)
    setPwdMsg(null)
    setProfileErr(null)
    setProfileMsg(null)
    if (newPwd !== newPwd2) {
      setPwdErr('Yeni şifreler eşleşmiyor.')
      return
    }
    try {
      await customersApi.patchPassword(curPwd, newPwd)
      setPwdMsg('Şifreniz güncellendi.')
      setCurPwd('')
      setNewPwd('')
      setNewPwd2('')
    } catch (e) {
      setPwdErr(e instanceof Error ? e.message : 'Şifre değiştirilemedi')
    }
  }

  const toast = profileMsg || pwdMsg

  return (
    <div className="relative w-full min-w-0 space-y-10 pb-16">
      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 w-[min(100%-2rem,28rem)] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-900 shadow-lg">
          {toast}
        </div>
      ) : null}

      <section aria-labelledby="account-info-heading">
        <h2 id="account-info-heading" className="text-xl font-bold tracking-tight text-slate-900">
          Hesap bilgilerim
        </h2>
        <p className="mt-1 text-sm text-slate-600">Kişisel bilgilerinizi güncelleyin; şifrenizi güvenli tutun.</p>
        {profileErr && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{profileErr}</p>}
        <form onSubmit={saveProfile} className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="acc-first" className="text-sm font-medium text-slate-700">
                Ad
              </label>
              <input
                id="acc-first"
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor="acc-last" className="text-sm font-medium text-slate-700">
                Soyad
              </label>
              <input
                id="acc-last"
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="acc-email" className="text-sm font-medium text-slate-700">
              E-posta
            </label>
            <input
              id="acc-email"
              type="email"
              disabled
              className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 shadow-inner"
              value={email}
              readOnly
              autoComplete="email"
            />
            <p className="mt-2 text-xs leading-relaxed text-slate-600">E-posta adresinizi değiştirmek için destek ile iletişime geçebilirsiniz.</p>
          </div>
          <div>
            <label htmlFor="acc-phone" className="text-sm font-medium text-slate-700">
              Telefon
            </label>
            <input
              id="acc-phone"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
          <button type="submit" className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700">
            Bilgileri kaydet
          </button>
        </form>
      </section>

      <section aria-labelledby="password-heading" className="border-t border-slate-200 pt-10">
        <h2 id="password-heading" className="text-xl font-bold tracking-tight text-slate-900">
          Şifre değiştirme
        </h2>
        <p className="mt-1 text-sm text-slate-600">Hesap güvenliğiniz için güçlü ve benzersiz bir şifre kullanın.</p>
        {pwdErr && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{pwdErr}</p>}
        <form onSubmit={savePassword} className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div>
            <label htmlFor="pwd-current" className="text-sm font-medium text-slate-700">
              Mevcut şifre
            </label>
            <input
              id="pwd-current"
              type="password"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              value={curPwd}
              onChange={(e) => setCurPwd(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div>
            <label htmlFor="pwd-new" className="text-sm font-medium text-slate-700">
              Yeni şifre
            </label>
            <input
              id="pwd-new"
              type="password"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <p className="mt-1.5 text-xs text-slate-500">En az 8 karakter.</p>
          </div>
          <div>
            <label htmlFor="pwd-new2" className="text-sm font-medium text-slate-700">
              Yeni şifre tekrar
            </label>
            <input
              id="pwd-new2"
              type="password"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              value={newPwd2}
              onChange={(e) => setNewPwd2(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
            Şifreyi güncelle
          </button>
        </form>
      </section>
    </div>
  )
}
