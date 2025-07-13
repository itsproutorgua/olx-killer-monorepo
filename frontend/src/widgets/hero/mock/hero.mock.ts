import hero_1 from '@/shared/assets/images/hero/hero_1.png'
import hero_2 from '@/shared/assets/images/hero/hero_2.png'
import hero_3 from '@/shared/assets/images/hero/hero_3.png'
import hero_4 from '@/shared/assets/images/hero/hero_4.png'
import hero_5 from '@/shared/assets/images/hero/hero_5.png'
import hero_6 from '@/shared/assets/images/hero/hero_6.png'

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
    src: hero_1,
    type: 'image/png',
    srcset: [
      { width: 375, items: [hero_1, hero_1] },
      { width: 1440, items: [hero_1, hero_1] },
    ],
  },
  {
    id: 2,
    alt: 'hero image',
    src: hero_2,
    type: 'image/png',
    srcset: [
      { width: 375, items: [hero_2, hero_2] },
      { width: 1440, items: [hero_2, hero_2] },
    ],
  },
  {
    id: 3,
    alt: 'hero image',
    src: hero_3,
    type: 'image/png',
    srcset: [
      { width: 375, items: [hero_3, hero_3] },
      { width: 1440, items: [hero_3, hero_3] },
    ],
  },
  {
    id: 4,
    alt: 'hero image',
    src: hero_4,
    type: 'image/png',
    srcset: [
      { width: 375, items: [hero_4, hero_4] },
      { width: 1440, items: [hero_4, hero_4] },
    ],
  },
  {
    id: 5,
    alt: 'hero image',
    src: hero_5,
    type: 'image/png',
    srcset: [
      { width: 375, items: [hero_5, hero_5] },
      { width: 1440, items: [hero_5, hero_5] },
    ],
  },
  {
    id: 6,
    alt: 'hero image',
    src: hero_6,
    type: 'image/png',
    srcset: [
      { width: 375, items: [hero_6, hero_6] },
      { width: 1440, items: [hero_6, hero_6] },
    ],
  },
]
