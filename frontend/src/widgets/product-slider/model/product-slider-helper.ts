// Helper to chunk array into groups of a certain size
import { Product } from '@/entities/product'

export const chunkArray = (array: Product[], size: number): Product[][] => {
  return array.reduce((result: Product[][], _, index) => {
    if (index % size === 0) {
      result.push(array.slice(index, index + size))
    }
    return result
  }, [])
}
