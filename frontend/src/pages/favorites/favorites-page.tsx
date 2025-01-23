import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { EmptyInbox } from '@/widgets/account/empty-inbox/empty-inbox.tsx'
import { HorizontalProductCard } from '@/widgets/product-card/ui/horizontal-product-card.tsx'
import { useFavorites } from '@/entities/favorite/library/hooks/use-favorites.tsx'
import { Separator } from '@/shared/ui/shadcn-ui/separator.tsx'
import { PageLoader } from '@/shared/ui'
import { ArrowDownSmall } from '@/shared/ui/icons/arrow-down-small.tsx'
import { PRIVATE_PAGES } from '@/shared/constants'

export const FavoritesPage = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useFavorites()

  if (isLoading) {
    return <PageLoader />
  }

  if (data?.length === 0) {
    return <EmptyInbox type='favorite' />
  }

  return (
    <div className='pt-10 xl:min-h-[calc(100dvh-200px)] xl:pl-[42px] xl:pt-[42px]'>
      <Link
        to={PRIVATE_PAGES.ACCOUNT}
        className='mb-[30px] flex items-center gap-[14px] xl:hidden'
      >
        <ArrowDownSmall className='rotate-90' />
        <h1 className='text-2xl font-semibold leading-[24px] text-black'>
          {t('account.favorites')}
        </h1>
      </Link>
      <div className='h-full w-full overflow-x-hidden'>
        <div className='flex flex-col gap-5'>
          {data?.map(product => (
            <div key={product.id}>
              <HorizontalProductCard
                key={product.id}
                product={product.product_details}
                listingStatus={'Favorite'}
              />
              <Separator className='mt-5 hidden w-full bg-gray-200 xl:block' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
