import { EmptyInbox } from '@/widgets/account/empty-inbox/empty-inbox.tsx'
import { HorizontalProductCard } from '@/widgets/product-card/ui/horizontal-product-card.tsx'
import { ListingResponse } from '@/entities/user-listings/models/types.ts'
import { Separator } from '@/shared/ui/shadcn-ui/separator.tsx'

export const renderListingsContent = (
  activeTab: string,
  data?: ListingResponse,
) => {
  if (data?.results.length === 0) return <EmptyInbox type={activeTab} />

  return (
    <div className='flex flex-col gap-5'>
      {data?.results.map(product => (
        <div key={product.id}>
          <HorizontalProductCard key={product.id} product={product} />
          <Separator className='mt-5 hidden w-full bg-gray-200 xl:block' />
        </div>
      ))}
    </div>
  )
}
