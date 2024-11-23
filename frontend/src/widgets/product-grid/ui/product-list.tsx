import { ProductCard } from '@/widgets/product-card'
import type { Product } from '@/entities/product'

export const ProductList = ({ data }: { data: Product[] }) => {
  return (
    <ul className='grid grid-cols-3 gap-x-5 gap-y-[60px]'>
      {data.map(product => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
