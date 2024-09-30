import hero_375 from '@/shared/assets/images/hero/hero-375.jpg'
import hero_375_x2 from '@/shared/assets/images/hero/hero-375x2.jpg'
import hero_1440 from '@/shared/assets/images/hero/hero-1440.jpg'
import hero_1440_x2 from '@/shared/assets/images/hero/hero-1440x2.jpg'

export interface HeroItem {
  id: number
  alt: string
  src: string
  type: string
  srcset: { width: number; items: string[] }[]
}

export const HERO_DATA: HeroItem[] = [
  {
    id: 1,
    alt: 'hero image',
    src: hero_375,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [hero_375, hero_375_x2] },
      { width: 1440, items: [hero_1440, hero_1440_x2] },
    ],
  },
  {
    id: 2,
    alt: 'hero image',
    src: hero_375,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [hero_375, hero_375_x2] },
      { width: 1440, items: [hero_1440, hero_1440_x2] },
    ],
  },
  {
    id: 3,
    alt: 'hero image',
    src: hero_375,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [hero_375, hero_375_x2] },
      { width: 1440, items: [hero_1440, hero_1440_x2] },
    ],
  },
  {
    id: 4,
    alt: 'hero image',
    src: hero_375,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [hero_375, hero_375_x2] },
      { width: 1440, items: [hero_1440, hero_1440_x2] },
    ],
  },
  {
    id: 5,
    alt: 'hero image',
    src: hero_375,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [hero_375, hero_375_x2] },
      { width: 1440, items: [hero_1440, hero_1440_x2] },
    ],
  },
]
