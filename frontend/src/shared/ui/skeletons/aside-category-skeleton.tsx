import AsideCategoryLoader from '@/shared/ui/loaders/aside-category.loader.tsx'

export const AsideCategorySkeleton = () => {
  return (
    <ul className='max-w-[263px] space-y-2.5'>
      {Array.from({ length: 13 }).map((_, index) => (
        <li key={index}>
          <AsideCategoryLoader /> {/* Render 13 loaders */}
        </li>
      ))}
    </ul>
  )
}
