import { useTranslation } from 'react-i18next'

import { FiltersBar } from '@/widgets/filters-bar'
import { PageToolbar } from '@/widgets/page-toolbar'
import { PagePagination } from '@/features/page-pagination'
import { SectionTitle } from '@/shared/ui'
import { APP_VARIABLES, type SortEnum } from '@/shared/constants/app.const'
import { useQueryParams } from '@/shared/library/hooks'
import { useProducts } from '../library'
import { ProductList } from './product-list'

export const ProductGrid = ({ path }: { path: string }) => {
  const { t } = useTranslation()
  const { getQueryParamByKey } = useQueryParams()

  const limit = APP_VARIABLES.LIMIT
  const sort = getQueryParamByKey('sort') as SortEnum
  const page = getQueryParamByKey('page')
    ? Number(getQueryParamByKey('page'))
    : 1

  const { data, cursor } = useProducts(
    {
      path,
      page,
      limit,
      sort,
    },
    {},
  )

  return (
    <>
      {cursor}

      {data && (
        <div>
          <PageToolbar count={data.count} />

          <div className='flex border-t border-border'>
            <aside className='w-[305px]'>
              <FiltersBar />
            </aside>

            <div className='flex-1 space-y-5'>
              <div className='border-b border-l border-border pb-[60px] pl-5 pt-[18px]'>
                <SectionTitle title={t('titles.announcementsAll')} />
                <ProductList data={data.results} />
              </div>

              <PagePagination count={data.count} limit={limit} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
