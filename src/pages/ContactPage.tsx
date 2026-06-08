import { ContactForm } from '../components/forms/ContactForm'
import { PageHero } from '../components/page/PageHero'
import { CTASection } from '../components/page/CTASection'
import { SectionHeader } from '../components/ui/SectionHeader'
import { defaultContactData } from '../data/allPagesData'
import { formatCompanyAddress } from '../data/legalCompanyInfo'
import { frontendImages } from '../data/frontendImages'
import { useHeroSection } from '../hooks/useHeroSection'
import { useLegalCompanyInfo } from '../hooks/useLegalCompanyInfo'
import { usePageSection } from '../hooks/usePageSection'
import { buildWhatsAppUrl, formatPhoneForTel } from '../lib/companyContact'
import { LAYOUT_CONTAINER_CLASS } from '../lib/layoutConstants'
import { Mail, MapPin, MessageSquare, Phone, Wrench } from 'lucide-react'
import { SURFACE_MUTED } from '../lib/sectionSurfaces'
import type { ContactFormSectionData } from '../types/sections'

const SUPPORT_TOPICS = [
  { icon: Wrench, title: 'Yazılım & Web Projeleri', desc: 'Kurumsal site, özel yazılım ve SaaS geliştirme talepleri.' },
  { icon: MessageSquare, title: 'E-Ticaret & Operasyon', desc: 'Mağaza kurulumu, entegrasyon ve dijital operasyon süreçleri.' },
  { icon: Mail, title: 'Danışmanlık & Destek', desc: 'Strateji, süreç iyileştirme ve mevcut sistem desteği.' },
] as const

export function ContactPage() {
  const company = useLegalCompanyInfo()
  const { heroData } = useHeroSection('contact', defaultContactData)
  const { data: contactForm } = usePageSection<ContactFormSectionData>('contact', 'contact-form', defaultContactData)

  const email = company.email?.trim()
  const phone = company.phone?.trim()
  const address = formatCompanyAddress(company) || company.address?.trim()
  const whatsappUrl = company.whatsapp?.trim() ? buildWhatsAppUrl(company.whatsapp) : null

  const contactCards = [
    email
      ? {
          key: 'email',
          title: 'E-posta',
          value: email,
          href: `mailto:${email}`,
          icon: Mail,
          iconClass: 'bg-blue-50 text-blue-600',
          valueClass: 'text-emerald-700',
        }
      : null,
    phone
      ? {
          key: 'phone',
          title: 'Telefon',
          value: phone,
          href: `tel:${formatPhoneForTel(phone)}`,
          icon: Phone,
          iconClass: 'bg-emerald-50 text-emerald-600',
          valueClass: 'text-emerald-700',
        }
      : null,
    whatsappUrl
      ? {
          key: 'whatsapp',
          title: 'WhatsApp',
          value: company.whatsapp,
          href: whatsappUrl,
          icon: MessageSquare,
          iconClass: 'bg-green-50 text-green-600',
          valueClass: 'text-emerald-700',
        }
      : null,
    address
      ? {
          key: 'address',
          title: 'Adres',
          value: address,
          href: null,
          icon: MapPin,
          iconClass: 'bg-violet-50 text-violet-600',
          valueClass: 'text-slate-600 leading-relaxed',
        }
      : null,
  ].filter(Boolean)

  return (
    <div className="bg-white">
      <PageHero
        eyebrow={heroData?.tag || 'İletişim'}
        title={heroData?.title || 'Projenizi Konuşalım'}
        description={
          heroData?.subtitle ||
          'Yazılım, e-ticaret veya dijital operasyon ihtiyaçlarınız için ekibimiz size en kısa sürede dönüş yapar.'
        }
        image={frontendImages.pages.contact}
        imageAlt="Woontegra iletişim"
        highlights={[{ title: 'Hızlı geri dönüş' }, { title: 'Ücretsiz ön değerlendirme' }]}
      />

      {contactCards.length > 0 ? (
        <section className={`${SURFACE_MUTED} py-20 md:py-24`}>
          <div className={LAYOUT_CONTAINER_CLASS}>
            <div
              className={`grid gap-6 ${
                contactCards.length >= 4
                  ? 'md:grid-cols-2 xl:grid-cols-4'
                  : contactCards.length === 3
                    ? 'md:grid-cols-3'
                    : 'md:grid-cols-2'
              }`}
            >
              {contactCards.map((card) => {
                const Icon = card!.icon
                const inner = (
                  <>
                    <div
                      className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card!.iconClass}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{card!.title}</h3>
                    <p className={`mt-2 text-sm ${card!.valueClass}`}>{card!.value}</p>
                  </>
                )

                if (card!.href) {
                  return (
                    <a
                      key={card!.key}
                      href={card!.href}
                      className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                      target={card!.href.startsWith('http') ? '_blank' : undefined}
                      rel={card!.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {inner}
                    </a>
                  )
                }

                return (
                  <div key={card!.key} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    {inner}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <SectionHeader
                eyebrow="Form"
                title={contactForm?.title || 'Mesaj Gönderin'}
                subtitle={contactForm?.subtitle || 'Projenizi kısaca anlatın; size uygun çözümü birlikte planlayalım.'}
                centered={false}
              />
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
                <ContactForm />
              </div>
            </div>
            <div className="lg:col-span-2">
              <SectionHeader
                eyebrow="Destek"
                title="Çalışma Alanları"
                subtitle="Hangi konularda destek veriyoruz?"
                centered={false}
              />
              <div className="space-y-4">
                {SUPPORT_TOPICS.map((topic) => (
                  <div key={topic.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <topic.icon className="mb-3 h-6 w-6 text-emerald-600" aria-hidden />
                    <h3 className="font-semibold text-slate-900">{topic.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{topic.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Teklif almak ister misiniz?"
        description="Proje kapsamınızı paylaşın; size özel bir yol haritası ve teklif hazırlayalım."
        buttonText="Teklif Al"
        buttonTo="/teklif-al"
        secondaryButtonText="SSS"
        secondaryButtonTo="/sss"
      />
    </div>
  )
}
