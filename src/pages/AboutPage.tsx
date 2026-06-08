import { Button } from '../components/ui/Button'
import { StaticImage } from '../components/ui/StaticImage'
import { frontendImages } from '../data/frontendImages'
import { LAYOUT_CONTAINER_CLASS } from '../lib/layoutConstants'
import {
  ArrowRight,
  Award,
  BarChart3,
  Boxes,
  Building2,
  Code2,
  Eye,
  Layers,
  Lightbulb,
  Package,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Sparkles,
  Target,
  Wrench,
} from 'lucide-react'

const HIGHLIGHT_CARDS = [
  {
    icon: Boxes,
    title: 'Kendi ürünlerini geliştiren yapı',
    color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Sparkles,
    title: 'Gerçek kullanım deneyiminden doğan çözümler',
    color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
    iconColor: 'text-blue-400',
  },
] as const

const WHAT_IS_CARDS = [
  {
    title: 'Ürün Geliştiren Yapı',
    desc: 'Kendi markalarını ve dijital ürünlerini geliştiren, yalnızca müşteri işi yapan klasik ajans modelinden ayrılan yapı.',
  },
  {
    title: 'Gerçek Deneyim',
    desc: 'E-ticaret, yazılım ve dijital operasyon süreçlerinde kendi projelerinden kazandığı deneyimi müşterilerine aktarır.',
  },
  {
    title: 'Sürdürülebilir Sistem',
    desc: 'İşletmelere sadece web sitesi değil, yönetilebilir ve büyüyebilir dijital altyapılar kurmayı hedefler.',
  },
] as const

const TIMELINE = [
  {
    icon: Eye,
    title: 'Klasik ajans modelinin eksikliklerini gördük',
    desc: 'Çoğu ajans müşteri projeleri üzerinde çalışır ancak kendi ürünlerini geliştirmez. Bu durum, gerçek kullanıcı deneyimi ve operasyonel zorlukları anlamayı zorlaştırır.',
    color: 'bg-blue-500',
  },
  {
    icon: Rocket,
    title: 'Kendi ürünlerimizi geliştirmeye başladık',
    desc: 'Farklı bir yol seçtik: Kendi ürünlerimizi geliştiren, markalarımızı yöneten ve bu süreçte edindiğimiz deneyimi müşteri projelerine aktaran bir yapı kurmak.',
    color: 'bg-purple-500',
  },
  {
    icon: Settings,
    title: 'Gerçek operasyon deneyimini sisteme dönüştürdük',
    desc: 'Yazılım geliştirme, e-ticaret ve dijital sistemler alanında hem kendi markalarını yöneten hem de işletmelere çözümler sunan bir teknoloji yapısına dönüştük.',
    color: 'bg-emerald-500',
  },
  {
    icon: Building2,
    title: 'Bugün işletmelere sürdürülebilir dijital yapı sunuyoruz',
    desc: 'Sadece kod yazmıyor, sistem kuruyoruz. Sadece tasarım yapmıyor, marka oluşturuyoruz. Sadece danışmanlık vermiyor, gerçek projeler yönetiyoruz.',
    color: 'bg-orange-500',
  },
] as const

const DIFFERENTIATORS = [
  {
    icon: Package,
    title: 'Sadece Hizmet Değil, Ürün',
    desc: 'Klasik ajanslar müşteri projeleri üzerinde çalışır. Biz ise kendi ürünlerimizi geliştiriyor, gerçek kullanıcılarla test ediyor ve piyasaya sunuyoruz. Bu deneyim, müşteri projelerinde de fark yaratıyor.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Award,
    title: 'Gerçek Deneyim',
    desc: 'Kendi markalarımızı aktif olarak yönetiyoruz. E-ticaret, SaaS yazılım, danışmanlık gibi farklı sektörlerde operasyonel deneyime sahibiz. Teorik bilgi değil, gerçek iş deneyimi sunuyoruz.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Layers,
    title: 'Tek Yapı',
    desc: 'Yazılım geliştirme, satış süreçleri ve operasyonel yönetimi tek çatı altında birleştiriyoruz. Bu entegre yapı sayesinde projeler daha hızlı, daha verimli ve daha sürdürülebilir şekilde hayata geçiyor.',
    gradient: 'from-emerald-500 to-teal-500',
  },
] as const

const BRANDS = [
  {
    name: 'Bilirkişi',
    image: frontendImages.brands.bilirkisi,
    desc: 'Hukuk ve aktüerya alanında kullanılan profesyonel hesaplama yazılımı. İşçi alacakları, kıdem-ihbar tazminatı ve tazminat hesaplamalarını otomatik gerçekleştirir.',
    url: 'https://www.bilirkisihesap.com/',
  },
  {
    name: 'Optimoon',
    image: frontendImages.brands.optimoon,
    desc: 'Doğal taş takılar, kristaller ve özel tasarım ürünlerin satışını gerçekleştiren e-ticaret markası.',
    url: 'https://optimoon.com/',
  },
  {
    name: 'Datça Tropikal',
    image: frontendImages.brands.datca,
    desc: "Datça'nın yerel üretim ve doğal ürünlerini satışa sunan e-ticaret markası.",
    url: 'https://datcatropikal.com/',
  },
  {
    name: 'Mercan Danışmanlık',
    image: frontendImages.brands.mercan,
    desc: 'Marka tescil, patent başvuruları ve fikri mülkiyet haklarını profesyonel şekilde yöneten danışmanlık markası.',
    url: 'https://mercandanismanlik.com/',
  },
] as const

const WORK_APPROACH = [
  {
    icon: Search,
    title: 'Analiz ederiz',
    desc: 'İhtiyaçları, hedefleri ve mevcut yapıyı doğru şekilde değerlendiririz.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Wrench,
    title: 'Sistemi kurarız',
    desc: 'Yazılım, e-ticaret ve dijital operasyon bileşenlerini entegre bir yapıda inşa ederiz.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Ölçer ve geliştiririz',
    desc: 'Performansı izler, kullanıcı deneyimini ve iş sonuçlarını sürekli iyileştiririz.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: RefreshCw,
    title: 'Sürdürülebilir hale getiririz',
    desc: 'Projeyi yayına almakla kalmaz; yönetilebilir ve büyüyebilir bir sistem olarak teslim ederiz.',
    color: 'from-orange-500 to-red-500',
  },
] as const

const STRUCTURE_STATS = [
  {
    icon: Target,
    title: 'Kendi markalarını yöneten yapı',
    desc: 'Aktif olarak geliştirdiğimiz ve yönettiğimiz markalar üzerinden gerçek operasyon deneyimi.',
  },
  {
    icon: Code2,
    title: 'Yazılım + e-ticaret + dijital operasyon',
    desc: 'Teknik geliştirme, satış ve operasyon süreçlerini birbirinden bağımsız değil, tek sistem olarak ele alıyoruz.',
  },
  {
    icon: Lightbulb,
    title: 'Ürün odaklı geliştirme yaklaşımı',
    desc: 'Geliştirilen projeler sadece teknik olarak değil, ticari olarak da sürdürülebilir hale gelir.',
  },
] as const

export function AboutPage() {
  const heroImage = frontendImages.aboutHero

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.18),transparent_70%)]" />
        <div className={`${LAYOUT_CONTAINER_CLASS} relative z-10`}>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-white">
              <div className="mb-5 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Hakkımızda</span>
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                Woontegra&apos;yı Tanıyın
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                Yazılım, e-ticaret ve dijital sistemler alanında kendi ürünlerini geliştiren, markalarını yöneten
                ve işletmelere sürdürülebilir dijital altyapılar sunan bir teknoloji şirketiyiz.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {HIGHLIGHT_CARDS.map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-xl border bg-gradient-to-br p-4 ${card.color}`}
                  >
                    <card.icon className={`mb-2 h-5 w-5 ${card.iconColor}`} aria-hidden />
                    <p className="text-sm font-medium leading-snug text-slate-100">{card.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/25 to-blue-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/40 p-2 shadow-2xl shadow-emerald-900/30 ring-1 ring-white/10">
                {heroImage && (
                  <StaticImage
                    src={heroImage}
                    alt="Woontegra ekibi ve dijital ürünler"
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WOONTEGRA NEDİR */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Woontegra Nedir?</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Woontegra, klasik bir ajans ya da yalnızca hizmet sunan bir yapı değildir. Kendi markalarını
                  kuran, ürünler geliştiren ve bu ürünleri aktif olarak yöneten bir teknoloji şirketidir.
                </p>
                <p>
                  Yazılım geliştirme, e-ticaret ve dijital sistemler alanında sadece müşteriler için değil, kendi
                  projeleri için de üretim yapan bir yapı kurduk. Bu sayede teorik değil, gerçek kullanım üzerinden
                  deneyim kazanan ve bunu projelere yansıtan bir sistem oluşturduk.
                </p>
                <p className="font-semibold text-slate-900">
                  Amacımız, işletmelere sadece bir hizmet sunmak değil, sürdürülebilir bir dijital yapı kurmalarını
                  sağlamaktır.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              {WHAT_IS_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NASIL BAŞLADIK — TIMELINE */}
      <section className="py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Nasıl Başladık?</h2>
            <p className="mt-4 text-base text-slate-600">
              Woontegra, piyasadaki klasik ajans modelinin eksikliklerini gözlemleyerek ortaya çıktı.
            </p>
          </div>
          <div className="mx-auto mt-14 max-w-3xl">
            <div className="relative space-y-0">
              <div className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-slate-200 via-emerald-300 to-slate-200 md:left-[19px]" />
              {TIMELINE.map((step, index) => (
                <div key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
                  <div className="relative z-10 flex shrink-0 flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${step.color} shadow-lg md:h-10 md:w-10`}
                    >
                      <step.icon className="h-4 w-4 text-white md:h-5 md:w-5" aria-hidden />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      Adım {index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BİZİ FARKLI YAPAN NE */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Bizi Farklı Yapan Ne?</h2>
            <p className="mt-4 text-base text-slate-400">
              Klasik ajans modelinden ayrılan, ürün ve deneyim odaklı teknoloji yaklaşımımız.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {DIFFERENTIATORS.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/80 p-8 transition-all hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/20"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}
                >
                  <item.icon className="h-7 w-7 text-white" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AKTİF MARKALAR */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Aktif Olarak Yönettiğimiz Markalar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Woontegra yalnızca hizmet sunan bir yapı değil; kendi markalarını yöneten ve bu deneyimi
              müşterilerine aktaran bir teknoloji şirketidir.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {BRANDS.map((brand) => (
              <a
                key={brand.name}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-52">
                  <StaticImage
                    src={brand.image}
                    alt={brand.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="text-lg font-bold text-slate-900">{brand.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{brand.desc}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 group-hover:underline">
                    Siteyi ziyaret et
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ÇALIŞMA YAKLAŞIMIMIZ */}
      <section className="py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Çalışma Yaklaşımımız</h2>
            <p className="mt-4 text-base text-slate-600">
              Projeleri yalnızca teslim etmek değil; ölçülebilir ve sürdürülebilir sistemler kurmak.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WORK_APPROACH.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-md`}
                >
                  <item.icon className="h-6 w-6 text-white" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL BİR YAPI KURDUK */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Nasıl Bir Yapı Kurduk?
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Woontegra içinde, yazılım geliştirme, satış, operasyon ve marka yönetimi süreçlerini birbirinden
                  bağımsız değil, tek bir sistem olarak ele alıyoruz.
                </p>
                <p>
                  Bu yaklaşım sayesinde geliştirilen projeler sadece teknik olarak değil, ticari olarak da
                  sürdürülebilir hale gelir.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              {STRUCTURE_STATS.map((stat) => (
                <div
                  key={stat.title}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <stat.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{stat.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VİZYON */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 md:py-24">
        <div className={`${LAYOUT_CONTAINER_CLASS} max-w-4xl`}>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Nereye Gidiyoruz?</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-300">
            <p>
              Woontegra&apos;nın hedefi, yalnızca hizmet veren bir yapı olmak değil, kendi ürünleriyle büyüyen ve
              global ölçekte rekabet eden bir teknoloji şirketine dönüşmektir.
            </p>
            <p>Her geliştirdiğimiz proje, bu yapının bir parçası olarak ilerler.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className={`${LAYOUT_CONTAINER_CLASS} relative z-10 text-center`}>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            İşletmeniz için sürdürülebilir bir dijital yapı kuralım.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-emerald-50 md:text-lg">
            Web sitesi, e-ticaret altyapısı, özel yazılım ve dijital operasyon süreçlerinde size yalnızca hizmet
            değil, yönetilebilir bir sistem sunalım.
          </p>
          <Button
            variant="outline"
            to="/iletisim"
            className="mt-10 border-white/40 px-10 py-4 text-base text-white transition-all hover:bg-white hover:text-emerald-700"
          >
            İletişime Geç
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
