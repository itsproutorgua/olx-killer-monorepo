import {
  newProduct1_1440,
  newProduct1_1440_x2,
  newProduct2_1440,
  newProduct2_1440_x2,
  newProduct3_1440,
  newProduct3_1440_x2,
} from '@/shared/assets'
import type { BestDeal } from './best-deals.data'

export const NEW_PRODUCTS: BestDeal[] = [
  {
    id: 1,
    image: {
      alt: 'hero image',
      src: newProduct1_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct1_1440, newProduct1_1440_x2] },
        { width: 375, items: [newProduct1_1440, newProduct1_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 2,
    image: {
      alt: 'hero image',
      src: newProduct2_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct2_1440, newProduct2_1440_x2] },
        { width: 375, items: [newProduct2_1440, newProduct2_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 3,
    image: {
      alt: 'hero image',
      src: newProduct3_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct3_1440, newProduct3_1440_x2] },
        { width: 375, items: [newProduct3_1440, newProduct3_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 4,
    image: {
      alt: 'hero image',
      src: newProduct1_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct1_1440, newProduct1_1440_x2] },
        { width: 375, items: [newProduct1_1440, newProduct1_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 5,
    image: {
      alt: 'hero image',
      src: newProduct2_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct2_1440, newProduct2_1440_x2] },
        { width: 375, items: [newProduct2_1440, newProduct2_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 6,
    image: {
      alt: 'hero image',
      src: newProduct1_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct1_1440, newProduct1_1440_x2] },
        { width: 375, items: [newProduct1_1440, newProduct1_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 7,
    image: {
      alt: 'hero image',
      src: newProduct2_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct2_1440, newProduct2_1440_x2] },
        { width: 375, items: [newProduct2_1440, newProduct2_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 8,
    image: {
      alt: 'hero image',
      src: newProduct3_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct3_1440, newProduct3_1440_x2] },
        { width: 375, items: [newProduct3_1440, newProduct3_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 9,
    image: {
      alt: 'hero image',
      src: newProduct1_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct1_1440, newProduct1_1440_x2] },
        { width: 375, items: [newProduct1_1440, newProduct1_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
  {
    id: 10,
    image: {
      alt: 'hero image',
      src: newProduct2_1440,
      type: 'image/png',
      srcset: [
        { width: 1440, items: [newProduct2_1440, newProduct2_1440_x2] },
        { width: 375, items: [newProduct2_1440, newProduct2_1440_x2] },
      ],
    },
    description: 'Ipsum est magni consectetur in et est maxime necessitatibus.',
    price: '123',
  },
]
