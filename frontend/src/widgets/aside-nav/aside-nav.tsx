import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { CATEGORIES } from '@/entities/category'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/shared/ui/shadcn-ui/menubar.tsx'
import { Separator } from '@/shared/ui/shadcn-ui/separator'
import { CommentIcon, TruckIcon } from '@/shared/ui'

export const AsideNav = () => {
  const { t } = useTranslation()
  return (
    <aside className='w-[310px]'>
      <Menubar className='h-auto rounded-none border-0 p-0'>
        <ul className='space-y-2.5'>
          {CATEGORIES.map(cat => (
            <li key={cat.name}>
              <MenubarMenu key={cat.name}>
                <MenubarTrigger className='flex w-full cursor-pointer items-center justify-between gap-3 rounded-[81px] border-0 py-0.5 pl-1 pr-0 text-base/4 font-normal transition-colors duration-300 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground'>
                  <cat.icon />
                  <p className='flex-1 text-start'>{cat.title}</p>
                  <ChevronRight />
                </MenubarTrigger>
                <MenubarContent
                  side='right'
                  sideOffset={15}
                  className='grid grid-cols-3 gap-[50px] rounded-[15px] border-none bg-background px-[75px] py-12 text-foreground shadow-[1px_1px_5px_0_rgba(78,78,78,0.19)]'
                >
                  {cat.sub.map(sub => (
                    <div key={sub.label} className='space-y-5'>
                      <h4 className='text-base/[19.36px] font-semibold'>
                        {sub.label}
                      </h4>
                      <ul className='space-y-2.5'>
                        {sub.items.map(item => (
                          <li key={item.label}>
                            <Link to={item.href}>
                              <MenubarItem className='inline-block cursor-pointer bg-none p-0 text-base/[19.36px] font-normal transition-colors duration-300 focus:bg-background focus:text-accent'>
                                {item.label}
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
      <div className='flex items-center justify-center py-[27px] pr-[43px]'>
        <Separator className='bg-muted' />
      </div>
      <div className='felx flex-col space-y-2'>
        <div className='flex w-[271px] cursor-pointer items-center justify-between gap-3 rounded-[81px] py-0.5 pl-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'>
          <TruckIcon />
          <p className='flex-1'>{t('asideLinks.trackParcel')}</p>
        </div>
        <div className='flex w-[271px] cursor-pointer items-center justify-between gap-3 rounded-[81px] py-0.5 pl-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'>
          <CommentIcon />
          <p className='flex-1'>{t('asideLinks.helpCenter')}</p>
        </div>
      </div>
    </aside>
  )
}
