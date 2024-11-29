import React from 'react'
import ContentLoader from 'react-content-loader'

import { useMediaQuery } from '@/shared/library/hooks'

interface ProductPageLoaderProps {
  speed?: number
  width?: number
  height?: number
  viewBox?: string
  backgroundColor?: string
  foregroundColor?: string
}

const ProductPageSkeletonDesktop: React.FC<ProductPageLoaderProps> = props => (
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

const ProductPageSkeletonMobile: React.FC<ProductPageLoaderProps> = props => (
  <ContentLoader
    speed={2}
    width={1280}
    height={1131}
    viewBox='0 0 1280 1131'
    backgroundColor='#f3f3f3'
    foregroundColor='#cbc8c8'
    {...props}
  >
    <rect x='0' y='0' rx='10' ry='10' width='355' height='238' />
    <rect x='0' y='244' rx='10' ry='10' width='353' height='48' />
    <rect x='0' y='324' rx='10' ry='10' width='353' height='253.3' />
    <rect x='0' y='609.3' rx='10' ry='10' width='353' height='53' />
    <rect x='0' y='690.3' rx='10' ry='10' width='353' height='170' />
    <rect x='0' y='873.3' rx='10' ry='10' width='353' height='190' />
  </ContentLoader>
)

export const ProductPageSkeleton: React.FC<ProductPageLoaderProps> = props => {
  const isDesktop = useMediaQuery('(min-width: 1440px)')

  return isDesktop ? (
    <ProductPageSkeletonDesktop {...props} />
  ) : (
    <ProductPageSkeletonMobile {...props} />
  )
}
