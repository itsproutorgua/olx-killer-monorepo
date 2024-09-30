import hero_1440 from '@/shared/assets/images/hero/hero-1440.jpg'
import hero_1440_x2 from '@/shared/assets/images/hero/hero-1440x2.jpg'
import product_photo_2x from '@/shared/assets/images/product-photos/product_photo_2x.png'
import product_photo from '@/shared/assets/images/product-photos/product_photo.png'

import { HeroItem } from '@/widgets/hero/mock/hero.mock.ts'

export const PRODUCT_PHOTO: HeroItem[] = [
  {
    id: 1,
    alt: 'product photo',
    src: product_photo,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [product_photo, product_photo_2x] },
      { width: 1440, items: [product_photo, product_photo_2x] },
    ],
  },
  {
    id: 2,
    alt: 'product photo',
    src: product_photo,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [product_photo, product_photo_2x] },
      { width: 1440, items: [product_photo, product_photo_2x] },
    ],
  },
  {
    id: 3,
    alt: 'product photo',
    src: product_photo,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [product_photo, product_photo_2x] },
      { width: 1440, items: [product_photo, product_photo_2x] },
    ],
  },
  {
    id: 4,
    alt: 'product photo',
    src: product_photo,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [product_photo, product_photo_2x] },
      { width: 1440, items: [product_photo, product_photo_2x] },
    ],
  },
  {
    id: 5,
    alt: 'product photo',
    src: product_photo,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [product_photo, product_photo_2x] },
      { width: 1440, items: [product_photo, product_photo_2x] },
    ],
  },
  {
    id: 6,
    alt: 'product photo',
    src: hero_1440,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [hero_1440, hero_1440_x2] },
      { width: 1440, items: [hero_1440, hero_1440_x2] },
    ],
  },
  {
    id: 7,
    alt: 'product photo',
    src: product_photo,
    type: 'image/jpeg',
    srcset: [
      { width: 375, items: [product_photo, product_photo_2x] },
      { width: 1440, items: [product_photo, product_photo_2x] },
    ],
  },
]
