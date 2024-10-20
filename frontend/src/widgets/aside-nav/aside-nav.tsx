import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { categoryApi } from '@/entities/category'
import { CategoryResponse } from '@/entities/category/model/category.types.ts'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/shared/ui/shadcn-ui/menubar.tsx'
import { Separator } from '@/shared/ui/shadcn-ui/separator'
import { FacebookIconOutline, InstagramIconOutline } from '@/shared/ui'
import AsideCategoryLoader from '@/shared/ui/loaders/aside-category.loader.tsx'
import { QUERY_KEYS } from '@/shared/constants'

export const AsideNav = () => {
  const { t, i18n } = useTranslation()

  const {
    isLoading,
    isError,
    data: categories,
    error,
  } = useQuery<CategoryResponse[]>({
    queryKey: [QUERY_KEYS.CATEGORIES, i18n.language],
    queryFn: () => categoryApi.findAll(1),
    retry: 1,
    refetchOnWindowFocus: false,
  })

  if (isError) return <p>Error: {error.message}</p>

  // Render the categories
  return (
    <aside className='w-[305px] pl-[18px] pr-2'>
      <Menubar className='h-auto rounded-none border-0 p-0'>
        {isLoading && (
          <ul className='max-w-[263px] space-y-2.5'>
            {Array.from({ length: 13 }).map((_, index) => (
              <li key={index}>
                <AsideCategoryLoader /> {/* Render 13 loaders */}
              </li>
            ))}
          </ul>
        )}
        <ul className='max-w-[276px] space-y-2.5'>
          {categories?.map(cat => (
            <li key={cat.path}>
              <MenubarMenu key={cat.path}>
                <MenubarTrigger className='group flex w-full cursor-pointer items-center justify-between gap-3 rounded-[81px] border-0 py-0 pl-2 pr-2 text-base/4 font-normal transition-colors duration-300 hover:bg-primary-900 hover:text-gray-50 data-[state=open]:bg-primary-900 data-[state=open]:text-gray-50'>
                  {cat.icon ? (
                    <img
                      src={cat.icon}
                      alt={cat.title}
                      className='h-6 w-6 transition duration-300 ease-in-out focus:brightness-0 focus:invert focus:filter group-hover:brightness-0 group-hover:invert group-hover:filter group-data-[state=open]:brightness-0 group-data-[state=open]:invert group-data-[state=open]:filter'
                    />
                  ) : null}
                  <p className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start hover:overflow-visible'>
                    {cat.title}
                  </p>
                  <ChevronRight />
                </MenubarTrigger>
                <MenubarContent
                  side='right'
                  sideOffset={15}
                  className='grid max-w-[900px] grid-cols-3 gap-[50px] rounded-[15px] border-none bg-background px-[75px] py-12 text-foreground shadow-[1px_1px_5px_0_rgba(78,78,78,0.19)]'
                >
                  {cat.children.slice(0, 6).map(sub => (
                    <div key={sub.path} className='max-w-[155px] space-y-5'>
                      <Link to={`/catalog/${sub.path}`}>
                        <h4 className='overflow-hidden text-ellipsis whitespace-nowrap text-base/[19.36px] font-semibold hover:overflow-visible hover:text-primary-600'>
                          {sub.title}
                        </h4>
                      </Link>

                      <ul className='space-y-2.5'>
                        {sub.children.slice(0, 5).map(item => (
                          <li key={item.path}>
                            <Link to={`/catalog/${item.path}`}>
                              <MenubarItem className='max-w-[155px] cursor-pointer bg-none p-0 text-base/[19.36px] font-normal transition-colors duration-300 focus:text-primary-600'>
                                <p className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-start hover:overflow-visible hover:whitespace-nowrap'>
                                  {item.title}
                                </p>
                              </MenubarItem>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </li>
          ))}
        </ul>
      </Menubar>
      <div className='flex items-center justify-center pb-[26px] pr-[43px] pt-[19px]'>
        <Separator className='bg-gray-200' />
      </div>
      <div className='flex flex-col'>
        <p className='flex-1 pl-2.5'>{t('asideLinks.socialMedia')}</p>
        <div className='flex w-[271px] items-center gap-0 rounded-[81px] py-0.5'>
          <a
            href='#'
            aria-label='Instagram'
            className='cursor-pointer transition-colors duration-300 hover:text-primary-200'
          >
            <InstagramIconOutline />
          </a>
          <a
            href='#'
            aria-label='Facebook'
            className='cursor-pointer transition-colors duration-300 hover:text-primary-200'
          >
            <FacebookIconOutline />
          </a>
        </div>
      </div>
    </aside>
  )
}
