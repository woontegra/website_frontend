import type { PageData } from '../types/sections'

export const defaultHomeData: PageData = {
  slug: 'home',
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      order: 1,
      data: {
        tag: 'Woontegra',
        title: 'Dijital Dünyada Gerçek Çözümler Üretiyoruz',
        subtitle: 'Sadece yazılım geliştirmiyoruz, kendi ürünlerimizi yaratıyor ve yönetiyoruz. E-ticaret, SaaS, danışmanlık – hepsini deneyimliyoruz.',
        button1Text: 'Hizmetlerimiz',
        button2Text: 'İletişime Geç',
      },
    },
    {
      id: 'services-1',
      type: 'services',
      order: 2,
      data: {
        title: 'Hizmetlerimiz',
        subtitle: 'Dijital dönüşümünüz için ihtiyacınız olan her şey',
        items: [
          {
            title: 'Yazılım Geliştirme',
            description: 'Modern teknolojilerle özel yazılım çözümleri',
            icon: 'Code',
          },
          {
            title: 'Web Tasarım',
            description: 'Kullanıcı deneyimi odaklı modern web siteleri',
            icon: 'Palette',
          },
          {
            title: 'E-Ticaret',
            description: 'Satışlarınızı artıracak e-ticaret platformları',
            icon: 'ShoppingCart',
          },
          {
            title: 'SaaS Ürün Geliştirme',
            description: 'Ölçeklenebilir bulut tabanlı yazılım çözümleri',
            icon: 'Cloud',
          },
          {
            title: 'Marka & Patent',
            description: 'Marka tescil ve patent başvuru süreçleri',
            icon: 'Award',
          },
          {
            title: 'Dijital Danışmanlık',
            description: 'Dijital dönüşüm stratejileri ve danışmanlık',
            icon: 'Lightbulb',
          },
        ],
      },
    },
    {
      id: 'brands-1',
      type: 'brands',
      order: 3,
      data: {
        title: 'Aktif Olarak Yönettiğimiz Markalar',
        subtitle: 'Kendi ürünlerimizi geliştiriyor ve yönetiyoruz',
        items: [
          {
            name: 'Bilirkişi Hesaplama',
            description: 'Hukuk ve aktüerya alanında profesyonel hesaplama yazılımı',
            image: '/brands/bilirkisi.png',
          },
          {
            name: 'Optimoon',
            description: 'Doğal taş ve özel tasarım ürünler e-ticaret platformu',
            image: '/brands/optimoon.png',
          },
          {
            name: 'Datça Tropikal',
            description: 'Datça bölgesine ait doğal ve yerel ürünler',
            image: '/brands/datca.png',
          },
          {
            name: 'Mercan Danışmanlık',
            description: 'Marka tescil ve patent danışmanlığı',
            image: '/brands/mercan.png',
          },
        ],
      },
    },
    {
      id: 'why-1',
      type: 'why',
      order: 4,
      data: {
        title: 'Neden Woontegra?',
        subtitle: 'Bizi farklı kılan özellikler',
        items: [
          {
            title: 'Gerçek Ürün Deneyimi',
            description: 'Sadece hizmet sunmuyoruz, kendi ürünlerimizi geliştirip yönetiyoruz.',
            icon: 'Rocket',
          },
          {
            title: 'Uçtan Uca Sistem',
            description: 'Tasarımdan yayına, bakımdan güncellemelere kadar her şey bizde.',
            icon: 'Layers',
          },
          {
            title: 'Performans Odaklı',
            description: 'Hızlı, güvenli ve ölçeklenebilir çözümler üretiyoruz.',
            icon: 'Zap',
          },
          {
            title: 'Modern Teknoloji',
            description: 'React, Node.js, PostgreSQL gibi güncel teknolojiler kullanıyoruz.',
            icon: 'Cpu',
          },
          {
            title: 'Aktif Markalar',
            description: 'Yönettiğimiz markalarla sürekli deneyim kazanıyoruz.',
            icon: 'TrendingUp',
          },
          {
            title: 'Sürekli Gelişim',
            description: 'Projelerimizi sürekli geliştiriyor ve iyileştiriyoruz.',
            icon: 'RefreshCw',
          },
        ],
      },
    },
    {
      id: 'process-1',
      type: 'process',
      order: 5,
      data: {
        title: 'Çalışma Sürecimiz',
        subtitle: 'Projenizi hayata geçirme adımları',
        steps: [
          {
            number: 1,
            title: 'Analiz',
            description: 'İhtiyaçlarınızı dinliyor ve detaylı analiz yapıyoruz.',
          },
          {
            number: 2,
            title: 'Planlama',
            description: 'Proje yol haritası ve teknik altyapı planlanıyor.',
          },
          {
            number: 3,
            title: 'Geliştirme',
            description: 'Modern teknolojilerle projenizi hayata geçiriyoruz.',
          },
          {
            number: 4,
            title: 'Yayın & Destek',
            description: 'Projenizi yayınlıyor ve sürekli destek sağlıyoruz.',
          },
        ],
      },
    },
    {
      id: 'cta-1',
      type: 'cta',
      order: 6,
      data: {
        title: 'Projenizi Hayata Geçirelim',
        subtitle: 'Dijital dönüşüm yolculuğunuza bugün başlayın',
        buttonText: 'Hemen İletişime Geç',
      },
    },
  ],
}
