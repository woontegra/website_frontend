import type { FAQItem } from '../types'

export const faqCategories = ['Hizmetler', 'Proje süreçleri', 'Marka tescil', 'Yazılım', 'Bakım & destek', 'Lisanslama']

export const faqs: FAQItem[] = [
  { question: 'Hangi hizmetleri sunuyorsunuz?', answer: 'Yazılım geliştirme, web tasarım, e-ticaret, SaaS, marka ve patent vekilliği, oyun geliştirme ve dijital danışmanlık hizmetleri sunuyoruz.', category: 'Hizmetler' },
  { question: 'Proje süreci nasıl işliyor?', answer: 'İhtiyaç analizi, teklif ve planlama, geliştirme ve teslim aşamalarıyla ilerliyoruz. Süreç boyunca düzenli paylaşım yapıyoruz.', category: 'Proje süreçleri' },
  { question: 'Marka başvurusu ne kadar sürer?', answer: 'Resmi süreç TPE\'ye bağlıdır. Başvuru hazırlığı ve takip hizmetimizle süreci yönetiyoruz.', category: 'Marka tescil' },
  { question: 'Yazılım projelerinde hangi teknolojiler kullanılıyor?', answer: 'Proje ihtiyacına göre React, Node.js, .NET, Python ve uygun veritabanları kullanıyoruz.', category: 'Yazılım' },
  { question: 'Teslim sonrası bakım ve destek var mı?', answer: 'Evet. Proje kapsamına göre bakım, güncelleme ve teknik destek paketleri sunuyoruz.', category: 'Bakım & destek' },
  { question: 'Lisanslama nasıl çalışıyor?', answer: 'Ürün ve projeye göre tek seferlik lisans veya abonelik modeli uygulanabilir. Teklif aşamasında netleştirilir.', category: 'Lisanslama' },
]
