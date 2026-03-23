import { services } from '../../data/services'
import { SectionHeader } from '../ui/SectionHeader'
import { ServiceCard } from '../ui/ServiceCard'
import { Button } from '../ui/Button'

export function ServiceCards() {
  return (
    <section className="animate-fade-up bg-white py-24 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Hizmetlerimiz"
          subtitle="Yazılımdan marka vekilliğine, e-ticaretten oyun geliştirmeye geniş bir hizmet yelpazesi."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.shortDescription}
              href={`/hizmetler/${service.slug}`}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="secondary" to="/hizmetler">
            Tüm hizmetleri görüntüle
          </Button>
        </div>
      </div>
    </section>
  )
}
