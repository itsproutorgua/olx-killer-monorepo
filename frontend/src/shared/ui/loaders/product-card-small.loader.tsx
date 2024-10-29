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

const ProductCardLoaderSmall: React.FC<ProductCardLoaderProps> = props => (
  <ContentLoader
    speed={2}
    width={171.5}
    height={224}
    viewBox='0 0 171.5 224'
    backgroundColor='#f3f3f3'
    foregroundColor='#cbc8c8'
    {...props}
  >
    <rect x='0' y='1' rx='15' ry='15' width='169' height='120' />
    <rect x='1' y='187' rx='6' ry='6' width='100' height='30' />
    <rect x='0' y='132' rx='7' ry='7' width='169' height='41' />
  </ContentLoader>
)

export default ProductCardLoaderSmall
