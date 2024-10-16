import { useEffect, useState } from 'react'
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
import { Category } from '@/entities/category/model/product.types.ts'
import { categoryApi } from "@/entities/category"

export const AsideNav = () => {
  const { t, i18n } = useTranslation() // Get the i18n instance
  const [categories, setCategories] = useState<Category[]>([])

  const mainUrl = 'http://olx.erpsolutions.com.ua:8000/'

  // Fetch categories whenever the language changes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.findAll(1) // Pass current language
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [i18n.language]) // Dependency array includes i18n.language

  return (
    <aside className='w-[310px]'>
      <Menubar className='h-auto rounded-none border-0 p-0'>
        <ul className='space-y-2.5'>
          {categories.map((cat) => (
            <li key={cat.path}>
              <MenubarMenu key={cat.path}>
                <MenubarTrigger className='flex w-full cursor-pointer items-center justify-between gap-3 rounded-[81px] border-0 py-0.5 pl-1 pr-0 text-base/4 font-normal transition-colors duration-300 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary data-[state=open]:text-primary-foreground'>
                  {cat.icon ? (
                    <img
                      src={mainUrl + cat.icon}
                      alt={cat.title}
                      className='w-6 h-6'
                    />
                  ) : null}
                  <p className='flex-1 text-start'>{cat.title}</p>
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
  )
}
