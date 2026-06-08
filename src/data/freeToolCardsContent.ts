export const FREE_TOOL_CARDS_KEY = 'freeToolCards'

export type FreeToolCardStatus = 'active' | 'coming-soon' | 'disabled'

export type FreeToolImageKey = 'sifre-kasasi' | 'none'

export type FreeToolCardConfig = {
  id: string
  name: string
  description: string
  status: FreeToolCardStatus
  buttonText: string
  href: string
  imageKey: FreeToolImageKey
  order: number
  enabled: boolean
}

export type FreeToolCardsBundle = {
  cards: FreeToolCardConfig[]
}

function normalizeStatus(status: string): FreeToolCardStatus {
  if (status === 'active' || status === 'coming-soon' || status === 'disabled') return status
  return 'coming-soon'
}

function normalizeCard(card: FreeToolCardConfig, index: number): FreeToolCardConfig {
  const imageKey: FreeToolImageKey = card.imageKey === 'sifre-kasasi' ? 'sifre-kasasi' : 'none'
  return {
    id: card.id || `tool-${index}`,
    name: card.name?.trim() || 'Başlıksız',
    description: card.description?.trim() || '',
    status: normalizeStatus(card.status),
    buttonText: card.buttonText?.trim() || 'İncele',
    href: card.href?.trim() || '#',
    imageKey,
    order: typeof card.order === 'number' ? card.order : index,
    enabled: card.enabled !== false,
  }
}

export function mergeFreeToolCards(
  defaults: FreeToolCardsBundle,
  partial?: Partial<FreeToolCardsBundle> | null,
): FreeToolCardsBundle {
  if (!partial?.cards?.length) return { cards: defaults.cards.map((c, i) => normalizeCard(c, i)) }
  return { cards: partial.cards.map((card, i) => normalizeCard(card, i)) }
}

export const defaultFreeToolCardsBundle: FreeToolCardsBundle = {
  cards: [
    {
      id: 'sifre-kasasi',
      name: 'Woontegra Şifre Kasası',
      description: 'Giriş bilgilerinizi yerel ve şifreli şekilde saklayan ücretsiz Windows masaüstü uygulaması.',
      status: 'active',
      buttonText: 'Aracı incele',
      href: '/ucretsiz-araclar/sifre-kasasi',
      imageKey: 'sifre-kasasi',
      order: 0,
      enabled: true,
    },
    {
      id: 'calculator',
      name: 'Dijital Hesaplayıcı Araçları',
      description: 'İş süreçleri için pratik hesaplama araçları — yakında.',
      status: 'coming-soon',
      buttonText: 'Yakında',
      href: '#',
      imageKey: 'none',
      order: 1,
      enabled: true,
    },
    {
      id: 'ops-panel',
      name: 'Operasyon Kontrol Paneli',
      description: 'Küçük işletmeler için hafif operasyon takip aracı — planlama aşamasında.',
      status: 'coming-soon',
      buttonText: 'Yakında',
      href: '#',
      imageKey: 'none',
      order: 2,
      enabled: true,
    },
  ],
}

export function getActiveFreeToolCards(bundle: FreeToolCardsBundle): FreeToolCardConfig[] {
  return bundle.cards.filter((card) => card.enabled).sort((a, b) => a.order - b.order)
}

export function getToolBadge(status: FreeToolCardStatus): string {
  if (status === 'active') return 'Yayında'
  if (status === 'coming-soon') return 'Yakında'
  return 'Pasif'
}
