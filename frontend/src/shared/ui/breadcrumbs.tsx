import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shared/ui/shadcn-ui/breadcrumb'
import { HomeIconBreadcrumb } from '@/shared/ui/icons-pack.tsx'
import { cn } from '@/shared/library/utils'

export const Breadcrumbs = ({
  crumbs = [],
  className = '',
}: {
  crumbs: {
    text: string
    href?: string
  }[]
  className?: string
}) => {
  const { t } = useTranslation()

  return (
    <Breadcrumb className={cn('mb-4 xl:mb-[38px]', className)}>
      {/* Mobile screen */}
      <BreadcrumbList className='text-[13px]/[15.73px] text-foreground md:hidden'>
        <BreadcrumbItem className='gap-2'>
          <ChevronLeft className='size-6' />
          <BreadcrumbLink href='/'>{t('crumbs.home')}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>

      {/* Tablet and Desktop screen */}
      <BreadcrumbList className='hidden gap-2 text-[13px]/[15.73px] text-foreground md:flex xl:gap-3 xl:text-base/[19.36px]'>
        <BreadcrumbItem>
          <BreadcrumbLink
            href='/'
            className='hover:text-primary-500 active:text-primary-500'
          >
            <HomeIconBreadcrumb className='h-6 w-6' />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.length > 0 &&
          crumbs.map(crumb => (
            <React.Fragment key={crumb.text}>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='last:text-gray-500 hover:text-primary-500 last:hover:text-gray-500 active:text-primary-500'>
                <BreadcrumbLink href={crumb.href}>{crumb.text}</BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
