import {
  bestDeals_375,
  bestDeals_375_x2,
  bestDeals_1440,
  bestDeals_1440_x2,
} from '@/shared/assets'

export interface BestDeal {
  id: number
  image: {
    alt: string
    src: string
    type: string
    srcset: { width: number; items: string[] }[]
  }
  description: string
  price: string
}

export const BEST_DEALS: BestDeal[] = [
  {
    id: 1,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 2,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 3,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 4,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 5,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 6,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 7,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 8,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 9,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 10,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 11,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 12,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 13,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 14,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 15,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 16,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 17,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 18,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 19,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 20,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 21,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 22,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 23,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 24,
    image: {
      alt: 'hero image',
      src: bestDeals_375,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [bestDeals_1440, bestDeals_1440_x2] },
        { width: 375, items: [bestDeals_375, bestDeals_375_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
]
