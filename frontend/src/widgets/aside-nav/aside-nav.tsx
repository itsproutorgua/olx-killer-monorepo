import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/shared/ui/shadcn-ui/menubar.tsx'
import { Separator } from '@/shared/ui/shadcn-ui/separator'
import { FacebookIconOutline, InstagramIconOutline } from '@/shared/ui'
import { categoryApi } from "@/entities/category";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import {CategoryResponse } from "@/entities/category/model/category.types.ts";

export const AsideNav = () => {
  const { t, i18n } = useTranslation();

  const mainUrl = 'http://olx.erpsolutions.com.ua:8000/';

  const { isLoading, isError, data: categories, error } = useQuery<CategoryResponse[]>({
    queryKey: [QUERY_KEYS.CATEGORIES, i18n.language],
    queryFn: () => categoryApi.findAll(1),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Handle loading and error states
  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  // Render the categories
  return (
    <aside className='w-[305px] pl-[26px] pr-4'>
      <Menubar className='h-auto rounded-none border-0 p-0'>
        <ul className='space-y-2.5 max-w-[263px]'>
          {categories?.map((cat) => (
            <li key={cat.path}>
              <MenubarMenu key={cat.path}>
                <MenubarTrigger className='flex w-full cursor-pointer items-center justify-between gap-3 rounded-[81px] border-0 py-0 pl-0 pr-0 text-base/4 font-normal transition-colors duration-300 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground'>
                  {cat.icon ? (
                    <img
                      src={mainUrl + cat.icon}
                      alt={cat.title}
                      className='w-6 h-6'
                    />
                  ) : null}
                  <p className='flex-1 text-start text-ellipsis whitespace-nowrap overflow-hidden'>{cat.title}</p>
                  <ChevronRight />
                </MenubarTrigger>
                <MenubarContent
                  side='right'
                  sideOffset={15}
                  className='grid grid-cols-3 gap-[50px] rounded-[15px] border-none bg-background px-[75px] py-12 text-foreground shadow-[1px_1px_5px_0_rgba(78,78,78,0.19)]'
                >
                  {cat.children.map((sub) => (
                    <div key={sub.path} className='space-y-5'>
                      <Link to={`/${sub.path}`}>
                        <h4 className='text-base/[19.36px] font-semibold hover:text-accent'>
                          {sub.title}
                        </h4>
                      </Link>

                      <ul className='space-y-2.5'>
                        {sub.children.map((item) => (
                          <li key={item.path}>
                            <Link to={`/${item.path}`}>
                              <MenubarItem className='inline-block cursor-pointer bg-none p-0 text-base/[19.36px] font-normal transition-colors duration-300 focus:bg-background focus:text-accent'>
                                {item.title}
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
      <div className='flex items-center justify-center pt-[19px] pb-[26px] pr-[43px]'>
        <Separator className='bg-gray-200' />
      </div>
      <div className='flex flex-col'>
        <p className='flex-1 pl-2.5'>{t('asideLinks.socialMedia')}</p>
        <div
          className='flex w-[271px] cursor-pointer items-center gap-0 rounded-[81px] py-0.5 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'>
          <a
            href='#'
            aria-label='Instagram'
            className='transition-colors duration-300 hover:text-primary-200'
          >
            <InstagramIconOutline />
          </a>
          <a
            href='#'
            aria-label='Facebook'
            className='transition-colors duration-300 hover:text-primary-200'
          >
            <FacebookIconOutline />
          </a>
        </div>
      </div>
    </aside>
  );
};
