import React from 'react'
import ContentLoader from 'react-content-loader'

interface ProductPageLoaderProps {
  speed?: number
  width?: number
  height?: number
  viewBox?: string
  backgroundColor?: string
  foregroundColor?: string
}

const ProductPageSkeleton: React.FC<ProductPageLoaderProps> = props => (
  <ContentLoader
    speed={2}
    width={1280}
    height={1131}
    viewBox='0 0 1280 1131'
    backgroundColor='#f3f3f3'
    foregroundColor='#cbc8c8'
    {...props}
  >
    <rect x='0' y='0' rx='10' ry='10' width='629' height='613' />

    <rect x='0' y='630' rx='15' ry='15' width='629' height='88' />

    <rect x='669' y='0' rx='15' ry='15' width='610' height='107' />

    <rect x='669' y='141' rx='15' ry='15' width='296' height='126' />

    <rect x='669' y='321' rx='15' ry='15' width='296' height='200' />
    <rect x='985' y='321' rx='15' ry='15' width='296' height='200' />

    <rect x='669' y='575' rx='15' ry='15' width='610' height='138' />
    <rect x='669' y='809' rx='15' ry='15' width='611' height='127' />
    <rect x='669' y='956' rx='15' ry='15' width='611' height='186' />
  </ContentLoader>
)

export default ProductPageSkeleton
