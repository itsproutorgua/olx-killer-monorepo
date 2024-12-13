import React from 'react'
import ContentLoader from 'react-content-loader'

interface AsideCategoryProps {
  speed?: number
  width?: number
  height?: number
  viewBox?: string
  backgroundColor?: string
  foregroundColor?: string
}

const PopularCategoryLoader: React.FC<AsideCategoryProps> = props => (
  <ContentLoader
    speed={2}
    width={150}
    height={185.8}
    viewBox='0 0 150 185.8'
    backgroundColor='#f3f3f3'
    foregroundColor='#cbc8c8'
    {...props}
  >
    <rect x='15' y='161' rx='5' ry='5' width='120' height='19' />
    <rect x='0' y='0' rx='30' ry='30' width='150' height='150' />
  </ContentLoader>
)

export default PopularCategoryLoader
