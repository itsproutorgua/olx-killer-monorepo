import women_dresses from '@/shared/assets/images/categories/women/dresses.png'
import women_outerwear from '@/shared/assets/images/categories/women/outerwear.png'
import women_pants_jeans from '@/shared/assets/images/categories/women/pants&jeans.png'
import women_skirts from '@/shared/assets/images/categories/women/skirts.png'
import women_sportswear from '@/shared/assets/images/categories/women/sportswear.png'
import women_suits from '@/shared/assets/images/categories/women/suits.png'
import women_tops_blouses from '@/shared/assets/images/categories/women/tops&blouses.png'

export const WOMEN_CLOTHING = [
  {
    label: 'Dresses',
    image: women_dresses,
    alt: 'Women dresses subcategory image',
    href: '/catalog/clothes/women/dresses',
  },
  {
    label: 'Tops and Blouses',
    image: women_tops_blouses,
    alt: 'Women tops and blouses subcategory image',
    href: '/catalog/clothes/women/tops&blouses',
  },
  {
    label: 'Pants and Jeans',
    image: women_pants_jeans,
    alt: 'Women pants and jeans subcategory image',
    href: '/catalog/clothes/women/pants&jeans',
  },
  {
    label: 'Skirts',
    image: women_skirts,
    alt: 'Women skirts subcategory image',
    href: '/catalog/clothes/women/skirts',
  },
  {
    label: 'Outerwear',
    image: women_outerwear,
    alt: 'Women outerwear subcategory image',
    href: '/catalog/clothes/women/outerwear',
  },
  {
    label: 'Suits',
    image: women_suits,
    alt: 'Women suits subcategory image',
    href: '/catalog/clothes/women/suits',
  },
  {
    label: 'Sportswear',
    image: women_sportswear,
    alt: 'Women sportswear subcategory image',
    href: '/catalog/clothes/women/sportswear',
  },
] as const
