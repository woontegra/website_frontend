import type { PageData } from '../types/sections'

// ABOUT PAGE - Gerçek içerik
export const defaultAboutData: PageData = {
  slug: 'about',
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      order: 1,
      data: {
        tag: 'Hakkımızda',
        title: 'Woontegra\'yı Tanıyın',
        subtitle: 'Yazılım, e-ticaret ve dijital sistemler alanında ürün geliştiren ve markalar yöneten bir teknoloji şirketiyiz.',
        button1Text: 'Hizmetlerimiz',
        button2Text: 'İletişime Geç',
      },
    },
    {
      id: 'text-1',
      type: 'text-content',
      order: 2,
      data: {
        title: 'Woontegra Nedir?',
        paragraphs: [
          'Woontegra, klasik bir ajans ya da yalnızca hizmet sunan bir yapı değildir.',
          'Kendi markalarını kuran, ürünler geliştiren ve bu ürünleri aktif olarak yöneten bir teknoloji şirketidir.',
          'Yazılım geliştirme, e-ticaret ve dijital sistemler alanında sadece müşteriler için değil, kendi projeleri için de üretim yapan bir yapı kurduk.',
          'Bu sayede teorik değil, gerçek kullanım üzerinden deneyim kazanan ve bunu projelere yansıtan bir sistem oluşturduk.',
        ],
        highlight: 'Amacımız, işletmelere sadece bir hizmet sunmak değil, sürdürülebilir bir dijital yapı kurmalarını sağlamaktır.',
      },
    },
    {
      id: 'text-2',
      type: 'text-content',
      order: 3,
      data: {
        title: 'Nasıl Başladık?',
        paragraphs: [
          'Woontegra, piyasadaki klasik ajans modelinin eksikliklerini gözlemleyerek ortaya çıktı.',
          'Çoğu ajans, müşteri projeleri üzerinde çalışır ancak kendi ürünlerini geliştirmez. Bu durum, gerçek kullanıcı deneyimi ve operasyonel zorlukları anlamayı zorlaştırır.',
          'Biz ise farklı bir yol seçtik: Kendi ürünlerimizi geliştiren, markalarımızı yöneten ve bu süreçte edindiğimiz deneyimi müşteri projelerine aktaran bir yapı kurmak.',
          'Bugün, yazılım geliştirme, e-ticaret ve dijital sistemler alanında hem kendi markalarını yöneten hem de işletmelere çözümler sunan bir teknoloji yapısına dönüştük.',
        ],
        highlight: 'Farkımız şu: Sadece kod yazmıyoruz, sistem kuruyoruz. Sadece tasarım yapmıyoruz, marka oluşturuyoruz. Sadece danışmanlık vermiyor, gerçek projeler yönetiyoruz.',
      },
    },
    {
      id: 'brands-1',
      type: 'brands',
      order: 4,
      data: {
        title: 'Aktif Olarak Yönettiğimiz Markalar',
        subtitle: 'Woontegra, sadece hizmet sunan bir yapı değil, aynı zamanda kendi markalarını oluşturan ve yöneten bir sistemdir.',
        items: [
          { name: 'Bilirkişi', description: 'Hukuk ve aktüerya alanında kullanılan profesyonel hesaplama yazılımıdır.', image: '/images/brand-bilirkisi.jpg' },
          { name: 'Optimoon', description: 'Doğal taş ve özel tasarım ürünlerin yer aldığı e-ticaret markamızdır.', image: '/images/brand-optimoon.jpg' },
          { name: 'Datça Tropikal', description: 'Yerel üretim ve doğal ürünlerin satışını gerçekleştiren markamızdır.', image: '/images/brand-datca.jpg' },
          { name: 'Mercan Danışmanlık', description: 'Marka tescil ve patent danışmanlık süreçlerini yöneten markamızdır.', image: '/images/brand-mercan.jpg' },
        ],
      },
    },
    {
      id: 'cta-1',
      type: 'cta',
      order: 5,
      data: {
        title: 'Birlikte Çalışalım',
        subtitle: 'Projeniz için bizimle iletişime geçin',
        buttonText: 'İletişime Geç',
      },
    },
  ],
}

// CONTACT PAGE
export const defaultContactData: PageData = {
  slug: 'contact',
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      order: 1,
      data: {
        tag: 'İletişim',
        title: 'Bizimle İletişime Geçin',
        subtitle: 'Projeleriniz için bizimle iletişime geçebilir, detaylı bilgi alabilirsiniz',
        button1Text: 'Formu Doldur',
        button2Text: 'Telefon Et',
      },
    },
    {
      id: 'contact-info-1',
      type: 'contact-info',
      order: 2,
      data: {
        email: 'info@woontegra.com',
        phone: '0532 317 17 55',
        whatsapp: '905323171755',
        address: 'İskele Mahallesi Bademli Caddesi 43/6 Datça-Muğla',
        mapEmbed: '',
      },
    },
    {
      id: 'contact-form-1',
      type: 'contact-form',
      order: 3,
      data: {
        title: 'Mesaj Gönderin',
        subtitle: 'Formu doldurun, en kısa sürede size dönüş yapalım',
        submitButtonText: 'Gönder',
      },
    },
  ],
}

// SOFTWARE DEV PAGE
export const defaultSoftwareDevData: PageData = {
  slug: 'software-dev',
  sections: [
    { id: 'hero-1', type: 'hero', order: 1, data: { tag: 'Yazılım Geliştirme', title: 'İşletmenize Özel Yazılım Geliştiriyoruz', subtitle: 'Hazır çözümler yerine, işinize özel geliştirilen sistemlerle süreçlerinizi hızlandırın ve kontrol altına alın.', button1Text: 'Teklif Al', button2Text: 'İletişime Geç' }},
    { id: 'features-1', type: 'service-features', order: 2, data: { title: 'Geliştirdiğimiz Yazılım Türleri', subtitle: 'İhtiyacınıza özel sistemler', features: [
      { title: 'Yönetim Panelleri', description: 'Admin sistemleri', icon: 'Settings' },
      { title: 'E-Ticaret Altyapıları', description: 'Online satış sistemleri', icon: 'ShoppingCart' },
      { title: 'Özel CRM Sistemleri', description: 'Müşteri yönetimi', icon: 'Users' },
      { title: 'SaaS Platformları', description: 'Bulut tabanlı yazılımlar', icon: 'Code' },
      { title: 'Otomasyon Sistemleri', description: 'Süreç otomasyonu', icon: 'Zap' },
      { title: 'Entegrasyon Sistemleri', description: 'Platform bağlantıları', icon: 'Database' },
    ]}},
    { id: 'cta-1', type: 'cta', order: 3, data: { title: 'Sizin İçin Nasıl Bir Sistem Geliştirelim?', subtitle: 'İhtiyacınızı anlatın, size özel çözümü birlikte kuralım.', buttonText: 'Teklif Al' }},
  ],
}

// WEB DESIGN PAGE
export const defaultWebDesignData: PageData = {
  slug: 'web-design',
  sections: [
    { id: 'hero-1', type: 'hero', order: 1, data: { tag: 'Web Tasarım', title: 'Modern ve Dönüşüm Odaklı Web Siteleri', subtitle: 'Sadece güzel görünen değil, ziyaretçiyi müşteriye dönüştüren web siteleri tasarlıyoruz.', button1Text: 'Teklif Al', button2Text: 'Örnekleri İncele' }},
    { id: 'features-1', type: 'service-features', order: 2, data: { title: 'Web Tasarım Hizmetlerimiz', subtitle: 'Sonuç odaklı tasarımlar', features: [
      { title: 'Kurumsal Web Siteleri', description: 'Profesyonel kurumsal siteler', icon: 'Monitor' },
      { title: 'Landing Page', description: 'Satış sayfaları', icon: 'TrendingUp' },
      { title: 'E-Ticaret Arayüz Tasarımı', description: 'Online mağaza tasarımları', icon: 'Layout' },
      { title: 'UI/UX Tasarım', description: 'Kullanıcı deneyimi odaklı', icon: 'Eye' },
      { title: 'Mobil Uyumlu Tasarım', description: 'Responsive arayüzler', icon: 'Smartphone' },
      { title: 'Hız Optimizasyonu', description: 'Performans iyileştirme', icon: 'Zap' },
    ]}},
    { id: 'cta-1', type: 'cta', order: 3, data: { title: 'Sitenizi Yeniden Tasarlayalım', subtitle: 'İşinize uygun modern ve etkili bir web sitesi oluşturalım.', buttonText: 'Teklif Al' }},
  ],
}

// ECOMMERCE PAGE
export const defaultEcommerceData: PageData = {
  slug: 'ecommerce',
  sections: [
    { id: 'hero-1', type: 'hero', order: 1, data: { tag: 'E-Ticaret', title: 'Satış Odaklı E-Ticaret Sistemleri Kuruyoruz', subtitle: 'Sadece bir mağaza değil, satış yapan ve büyüyen bir e-ticaret sistemi kurun.', button1Text: 'Teklif Al', button2Text: 'Demo Talep Et' }},
    { id: 'features-1', type: 'service-features', order: 2, data: { title: 'E-Ticaret Çözümlerimiz', subtitle: 'Satış odaklı sistemler', features: [
      { title: 'Özel E-Ticaret Siteleri', description: 'Sıfırdan özel geliştirme', icon: 'ShoppingCart' },
      { title: 'WooCommerce Altyapı Kurulumu', description: 'WordPress tabanlı mağaza', icon: 'ShoppingBag' },
      { title: 'Ödeme Sistemleri Entegrasyonu', description: 'Güvenli ödeme altyapısı', icon: 'CreditCard' },
      { title: 'Pazaryeri Entegrasyonları', description: 'Trendyol, Hepsiburada vb.', icon: 'TrendingUp' },
      { title: 'Ürün & Sipariş Yönetimi', description: 'Merkezi yönetim sistemi', icon: 'Package' },
      { title: 'Kargo ve Fatura Sistemleri', description: 'Otomatik entegrasyonlar', icon: 'Truck' },
    ]}},
    { id: 'cta-1', type: 'cta', order: 3, data: { title: 'E-Ticaretinizi Büyütmeye Hazır mısınız?', subtitle: 'Satış odaklı bir e-ticaret sistemi kuralım.', buttonText: 'Teklif Al' }},
  ],
}

// SAAS PAGE
export const defaultSaasData: PageData = {
  slug: 'saas',
  sections: [
    { id: 'hero-1', type: 'hero', order: 1, data: { tag: 'SaaS Ürün Geliştirme', title: 'Kendi Yazılım Ürününüzü Geliştirin', subtitle: 'SaaS (Software as a Service) modeli ile çalışan, ölçeklenebilir ve sürdürülebilir yazılım ürünleri geliştiriyoruz.', button1Text: 'Projeni Anlat', button2Text: 'Teklif Al' }},
    { id: 'features-1', type: 'service-features', order: 2, data: { title: 'SaaS Geliştirme Hizmetlerimiz', subtitle: 'Bulut tabanlı sistemler', features: [
      { title: 'Multi-Tenant Mimari', description: 'Çoklu müşteri desteği', icon: 'Users' },
      { title: 'Abonelik Yönetimi', description: 'Otomatik faturalandırma', icon: 'CreditCard' },
      { title: 'API First', description: 'Entegrasyon odaklı yapı', icon: 'Code' },
      { title: 'Ölçeklenebilirlik', description: 'Büyümeye hazır altyapı', icon: 'TrendingUp' },
    ]}},
    { id: 'cta-1', type: 'cta', order: 3, data: { title: 'SaaS Ürününüzü Geliştirin', subtitle: 'Bulut tabanlı yazılım için bizimle iletişime geçin', buttonText: 'Görüşme Ayarla' }},
  ],
}

// TRADEMARK PAGE
export const defaultTrademarkData: PageData = {
  slug: 'trademark',
  sections: [
    { id: 'hero-1', type: 'hero', order: 1, data: { tag: 'Marka & Patent', title: 'Marka Tescil ve Patent Başvuru Süreçleri', subtitle: 'Markanızı ve fikri mülkiyetinizi koruma altına alın', button1Text: 'Başvuru Yap', button2Text: 'Bilgi Al' }},
    { id: 'features-1', type: 'service-features', order: 2, data: { title: 'Marka & Patent Hizmetlerimiz', subtitle: 'Profesyonel danışmanlık', features: [
      { title: 'Marka Tescil', description: 'Türkiye ve uluslararası marka tescili', icon: 'Award' },
      { title: 'Patent Başvurusu', description: 'Buluş ve tasarım patent başvuruları', icon: 'Shield' },
      { title: 'Takip Hizmeti', description: 'Başvuru süreçlerinin takibi', icon: 'Eye' },
      { title: 'Danışmanlık', description: 'Fikri mülkiyet danışmanlığı', icon: 'MessageCircle' },
    ]}},
    { id: 'cta-1', type: 'cta', order: 3, data: { title: 'Markanızı Tescil Ettirin', subtitle: 'Marka ve patent başvuruları için bizimle iletişime geçin', buttonText: 'Başvuru Yap' }},
  ],
}

// CONSULTING PAGE
export const defaultConsultingData: PageData = {
  slug: 'consulting',
  sections: [
    { id: 'hero-1', type: 'hero', order: 1, data: { tag: 'Dijital Danışmanlık', title: 'Dijital Dönüşüm Stratejileri ve Danışmanlık', subtitle: 'İşletmenizin dijital dönüşüm yolculuğunda yanınızdayız', button1Text: 'Danışmanlık Al', button2Text: 'İletişim' }},
    { id: 'features-1', type: 'service-features', order: 2, data: { title: 'Danışmanlık Hizmetlerimiz', subtitle: 'Stratejik dijital dönüşüm', features: [
      { title: 'Dijital Strateji', description: 'Dijital dönüşüm yol haritası', icon: 'Map' },
      { title: 'Teknoloji Seçimi', description: 'Doğru teknoloji kararları', icon: 'Cpu' },
      { title: 'Süreç Optimizasyonu', description: 'İş süreçlerinin dijitalleştirilmesi', icon: 'Settings' },
      { title: 'Eğitim', description: 'Ekip eğitimleri ve workshop\'lar', icon: 'GraduationCap' },
    ]}},
    { id: 'cta-1', type: 'cta', order: 3, data: { title: 'Dijital Dönüşüm Başlatın', subtitle: 'Danışmanlık hizmetleri için bizimle iletişime geçin', buttonText: 'Görüşme Ayarla' }},
  ],
}

// SOLUTIONS PAGE
export const defaultSolutionsData: PageData = {
  slug: 'solutions',
  sections: [
    { id: 'hero-1', type: 'hero', order: 1, data: { tag: 'Çözümlerimiz', title: 'Geliştirdiğimiz Dijital Yapılar', subtitle: 'Woontegra sadece hizmet sunmaz, kendi ürünlerini geliştirir ve markalarını aktif olarak yönetir', button1Text: 'Ürünleri İncele', button2Text: 'İletişim' }},
    { id: 'text-1', type: 'text-content', order: 2, data: { title: 'Aktif Projelerimiz', paragraphs: ['Woontegra, yazılım geliştirme ve dijital sistem kurmanın ötesinde, kendi markalarını oluşturan ve yöneten bir yapı kurmuştur.', 'Aşağıda yer alan projeler, aktif olarak geliştirilen ve yönetilen sistemlerdir.'] }},
    { id: 'brands-1', type: 'brands', order: 3, data: { title: 'Ürünlerimiz', subtitle: 'Her biri farklı sektörde deneyim kazandığımız projeler', items: [
      { name: 'Bilirkişi Hesaplama Programı', description: 'Hukuk ve aktüerya alanında kullanılan profesyonel bir hesaplama yazılımıdır', image: '/images/bilirkisi-screenshot.jpg' },
      { name: 'Optimoon', description: 'Doğal taş ve özel tasarım ürünlerin yer aldığı e-ticaret markamızdır', image: '/images/optimoon-products.jpg' },
      { name: 'Datça Tropikal', description: 'Datça bölgesine ait doğal ve yerel ürünlerin satışını gerçekleştiren e-ticaret markasıdır', image: '/images/datca-products.jpg' },
      { name: 'Mercan Danışmanlık', description: 'Marka tescil ve patent başvurularını profesyonel şekilde yöneten danışmanlık markasıdır', image: '/images/mercan-trademark.jpg' },
    ]}},
    { id: 'cta-1', type: 'cta', order: 4, data: { title: 'Kendi Dijital Yapınızı Kurmak İster misiniz?', subtitle: 'Sizin için de özel çözümler geliştirebiliriz', buttonText: 'İletişime Geç' }},
  ],
}

// BLOG PAGE
export const defaultBlogData: PageData = {
  slug: 'blog',
  sections: [
    { id: 'hero-1', type: 'hero', order: 1, data: { tag: 'Blog', title: 'Bilgi, Deneyim ve Dijital İçerikler', subtitle: 'Yazılım, e-ticaret ve dijital sistemler hakkında güncel içerikler ve rehberler', button1Text: 'Tüm Yazılar', button2Text: 'Kategoriler' }},
    { 
      id: 'blog-posts-1', 
      type: 'blog-posts', 
      order: 2, 
      data: { 
        title: 'Blog Yazıları',
        subtitle: 'Dijital dünyada edindiğimiz deneyimleri paylaşıyoruz',
        categories: ['Tümü', 'Yazılım', 'E-Ticaret', 'SaaS', 'Marka & Patent', 'Dijital Büyüme'],
        posts: [
          { id: '1', slug: 'dijital-donusum-rehberi', title: 'Dijital Dönüşüm Rehberi: İşletmenizi Geleceğe Taşıyın', excerpt: 'Dijital dönüşüm sadece teknoloji değil, iş yapış şeklinizi değiştirmektir.', category: 'Dijital Büyüme', image: '/images/blog/digital-transformation.jpg', date: '20 Mart 2026', featured: true },
          { id: '2', slug: 'saas-urun-geliştirme-rehberi', title: 'SaaS Ürün Geliştirme Rehberi', excerpt: 'Başarılı bir SaaS ürünü geliştirmek için bilmeniz gereken temel adımlar.', category: 'SaaS', image: '/images/blog/saas-guide.jpg', date: '15 Mart 2026' },
          { id: '3', slug: 'e-ticaret-optimizasyonu', title: 'E-Ticaret Optimizasyonu', excerpt: 'Dönüşüm oranlarını artırmak için uygulanabilir stratejiler.', category: 'E-Ticaret', image: '/images/blog/ecommerce-opt.jpg', date: '12 Mart 2026' },
          { id: '4', slug: 'marka-tescil-sureci', title: 'Marka Tescil Süreci', excerpt: 'Markanızı koruma altına almak için izlemeniz gereken adımlar.', category: 'Marka & Patent', image: '/images/blog/trademark.jpg', date: '10 Mart 2026' },
          { id: '5', slug: 'modern-web-teknolojileri', title: 'Modern Web Teknolojileri', excerpt: 'Güncel web geliştirme araçları ve framework seçimi.', category: 'Yazılım', image: '/images/blog/web-tech.jpg', date: '8 Mart 2026' },
          { id: '6', slug: 'dijital-pazarlama-stratejileri', title: 'Dijital Pazarlama Stratejileri', excerpt: 'Online varlığınızı güçlendirmek için etkili yöntemler.', category: 'Dijital Büyüme', image: '/images/blog/digital-marketing.jpg', date: '5 Mart 2026' },
          { id: '7', slug: 'api-tasarimi-best-practices', title: 'API Tasarımı Best Practices', excerpt: 'Ölçeklenebilir ve güvenli API geliştirme prensipleri.', category: 'Yazılım', image: '/images/blog/api-design.jpg', date: '3 Mart 2026' },
        ]
      }
    },
    { id: 'cta-1', type: 'cta', order: 3, data: { title: 'Blog Yazılarımızdan Haberdar Olun', subtitle: 'Yeni içeriklerimizden haberdar olmak için bizi takip edin', buttonText: 'İletişime Geç' }},
  ],
}

// FAQ PAGE
export const defaultFAQData: PageData = {
  slug: 'faq',
  sections: [
    { id: 'hero-1', type: 'hero', order: 1, data: { tag: 'SSS', title: 'Sık Sorulan Sorular', subtitle: 'Hizmetlerimiz ve süreçlerimiz hakkında en çok merak edilen sorular', button1Text: 'Tüm Sorular', button2Text: 'İletişim' }},
    { id: 'faq-1', type: 'faq-list', order: 2, data: { title: 'Genel Sorular', items: [
      { question: 'Woontegra tam olarak ne yapıyor?', answer: 'Woontegra, yazılım geliştirme, e-ticaret altyapıları ve dijital sistemler kuran bir teknoloji şirketidir. Aynı zamanda kendi markalarını da geliştirir ve yönetir.' },
      { question: 'Sadece hizmet mi veriyorsunuz?', answer: 'Hayır. Hizmet vermenin yanında kendi ürünlerimizi ve e-ticaret markalarımızı da aktif olarak yönetiyoruz.' },
    ]}},
    { id: 'faq-2', type: 'faq-list', order: 3, data: { title: 'Yazılım', items: [
      { question: 'Hazır sistem mi kullanıyorsunuz?', answer: 'Hayır. İhtiyaca göre özel yazılım geliştiriyoruz.' },
      { question: 'Yazılım ne kadar sürede tamamlanır?', answer: 'Projenin kapsamına göre değişir. Basit projeler birkaç hafta, daha kapsamlı sistemler daha uzun sürebilir.' },
    ]}},
    { id: 'faq-3', type: 'faq-list', order: 4, data: { title: 'E-Ticaret', items: [
      { question: 'E-ticaret sitesi kuruyor musunuz?', answer: 'Evet. Satış odaklı ve yönetilebilir e-ticaret sistemleri kuruyoruz.' },
      { question: 'Ürün yükleme hizmeti var mı?', answer: 'Evet, talep edilirse ürün ve içerik girişleri ek hizmet olarak sağlanır.' },
    ]}},
    { id: 'faq-4', type: 'faq-list', order: 5, data: { title: 'Marka & Patent', items: [
      { question: 'Marka tescil sürecini siz mi yürütüyorsunuz?', answer: 'Evet. Süreç uzman vekil desteği ile baştan sona yönetilir.' },
      { question: 'Başvuru ne kadar sürer?', answer: 'Başvuru kısa sürede yapılır, ancak resmi tescil süreci birkaç ay sürebilir.' },
    ]}},
    { id: 'faq-5', type: 'faq-list', order: 6, data: { title: 'Süreç', items: [
      { question: 'Proje süreci nasıl ilerliyor?', answer: 'Analiz, planlama, geliştirme ve yayın aşamaları ile ilerliyoruz.' },
      { question: 'Teslim sonrası destek veriyor musunuz?', answer: 'Evet. Proje sonrası belirli süre destek sağlıyoruz.' },
    ]}},
    { id: 'cta-1', type: 'cta', order: 7, data: { title: 'Aklınıza Takılan Başka Bir Şey Mi Var?', subtitle: 'Sorularınız için bizimle iletişime geçebilirsiniz', buttonText: 'İletişime Geç' }},
  ],
}
