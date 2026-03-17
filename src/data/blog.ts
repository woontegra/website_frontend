export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime?: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'yazilim-projelerinde-dikkat-edilmesi-gerekenler',
    title: 'Yazılım Projelerinde Dikkat Edilmesi Gerekenler',
    excerpt: 'Başarılı bir yazılım projesi için kapsam, süre ve iletişim nasıl yönetilmeli?',
    category: 'Yazılım',
    date: '2025-03-01',
    readTime: '5 dk',
  },
  {
    id: '2',
    slug: 'e-ticaret-seo-ipuclari',
    title: 'E-Ticaret Siteleri için SEO İpuçları',
    excerpt: 'Mağazanızı arama motorlarında üst sıralara taşıyacak temel adımlar.',
    category: 'E-Ticaret',
    date: '2025-02-15',
    readTime: '4 dk',
  },
  {
    id: '3',
    slug: 'marka-tescili-neden-onemli',
    title: 'Marka Tescilinin Önemi',
    excerpt: 'Markanızı neden tescil ettirmeli ve süreç nasıl işler?',
    category: 'Marka Tescil',
    date: '2025-02-01',
    readTime: '3 dk',
  },
]
