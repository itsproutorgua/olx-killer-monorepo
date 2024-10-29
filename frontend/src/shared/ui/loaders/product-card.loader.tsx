import React from 'react'
import ContentLoader from 'react-content-loader'

interface ProductCardLoaderProps {
  speed?: number
  width?: number
  height?: number
  viewBox?: string
  backgroundColor?: string
  foregroundColor?: string
}

const ProductCardLoader: React.FC<ProductCardLoaderProps> = props => (
  <ContentLoader
    speed={2}
    width={305}
    height={346}
    viewBox='0 0 305 346'
    backgroundColor='#f3f3f3'
    foregroundColor='#cbc8c8'
    {...props}
  >
    <rect x='1' y='233' rx='5' ry='5' width='300' height='38' />
    <rect x='1' y='3' rx='15' ry='15' width='300' height='213' />
    <rect x='2' y='310' rx='5' ry='5' width='81' height='31' />
    <rect x='251' y='310' rx='5' ry='5' width='50' height='31' />
  </ContentLoader>
)

export default ProductCardLoader
