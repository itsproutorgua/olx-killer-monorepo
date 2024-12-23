import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/shadcn-ui/button.tsx'
import { Separator } from '@/shared/ui/shadcn-ui/separator.tsx'
import { FacebookIcon, InstagramIcon, Logo } from '@/shared/ui'

export const Footer = () => {
  const { t } = useTranslation()

  const FOOTER_CONTENT = [
    {
      title: t('footerContent.aboutCompany.title'),
      items: [
        { label: t('footerContent.aboutCompany.items.aboutUs'), link: '#' },
        { label: t('footerContent.aboutCompany.items.careers'), link: '#' },
        { label: t('footerContent.aboutCompany.items.partners'), link: '#' },
        { label: t('footerContent.aboutCompany.items.contactUs'), link: '#' },
        {
          label: t('footerContent.aboutCompany.items.forInvestors'),
          link: '#',
        },
        {
          label: t('footerContent.aboutCompany.items.legalInformation'),
          link: '#',
        },
        {
          label: t('footerContent.aboutCompany.items.privacyPolicy'),
          link: '#',
        },
        { label: t('footerContent.aboutCompany.items.termsOfUse'), link: '#' },
      ],
    },
    {
      title: t('footerContent.forSellers.title'),
      items: [
        {
          label: t('footerContent.forSellers.items.howToStartSelling'),
          link: '#',
        },
        {
          label: t('footerContent.forSellers.items.sellerRegistration'),
          link: '#',
        },
        {
          label: t('footerContent.forSellers.items.pricingAndFees'),
          link: '#',
        },
        {
          label: t('footerContent.forSellers.items.orderProcessing'),
          link: '#',
        },
        {
          label: t('footerContent.forSellers.items.rulesAndPolicies'),
          link: '#',
        },
        { label: t('footerContent.forSellers.items.sellerSupport'), link: '#' },
      ],
    },
    {
      title: t('footerContent.forBuyers.title'),
      items: [
        { label: t('footerContent.forBuyers.items.catalog'), link: '#' },
        {
          label: t('footerContent.forBuyers.items.dealsAndDiscounts'),
          link: '#',
        },
        { label: t('footerContent.forBuyers.items.howToOrder'), link: '#' },
        { label: t('footerContent.forBuyers.items.paymentMethods'), link: '#' },
        {
          label: t('footerContent.forBuyers.items.shippingAndPickup'),
          link: '#',
        },
        {
          label: t('footerContent.forBuyers.items.returnsAndExchanges'),
          link: '#',
        },
        { label: t('footerContent.forBuyers.items.faq'), link: '#' },
        { label: t('footerContent.forBuyers.items.myAccount'), link: '#' },
        {
          label: t('footerContent.forBuyers.items.customerSupport'),
          link: '#',
        },
      ],
    },
  ]

  return (
    <footer className='rounded-t-[30px] bg-primary-900 pt-[41px] text-gray-50 xl:pt-[71px]'>
      <div className='flex flex-col px-[20px] xl:container xl:flex-row'>
        <div className='pr-[74px] xl:w-1/2 xl:pr-[177px]'>
          <Logo className='block h-[56px] w-[156px]' />
          <p className='text-muted-foreground max-w-[294px] pt-[10px] text-[13px] xl:max-w-[454px] xl:pt-[15px] xl:text-base'>
            {t('footerContent.footerMessage')}
          </p>
          <div className='-ml-[10px] mt-10 hidden gap-[10px] xl:flex'>
            <a
              href='#'
              aria-label='Instagram'
              className='transition-colors duration-300 hover:text-primary-200'
            >
              <InstagramIcon />
            </a>
            <a
              href='#'
              aria-label='Facebook'
              className='transition-colors duration-300 hover:text-primary-200'
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-[49px] whitespace-nowrap pt-[76px] xl:grid-cols-3 xl:gap-24 xl:pt-0'>
          {FOOTER_CONTENT.map((section, index) => (
            <div key={index}>
              <h3 className='mb-5 font-semibold'>{section.title}</h3>
              <ul className='flex flex-col gap-[18px] xl:gap-3'>
                {section.items.map((item, idx) => (
                  <li key={idx} className='leading-none'>
                    <a
                      href={item.link}
                      className='relative inline-block duration-300 before:absolute before:bottom-[-5px] before:left-1/2 before:h-[2px] before:w-0 before:bg-primary-200 before:transition-all before:duration-300 before:ease-in-out hover:text-primary-200 hover:transition-colors hover:before:left-0 hover:before:w-full'
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className='px-[10px] pt-[60px] xl:container xl:pt-[119px]'>
        <Separator className='bg-gray-50' />
        <div className='flex flex-col-reverse items-center justify-between gap-[30px] pb-[18px] pt-[60px] xl:flex-row xl:py-5'>
          <p>2024 OLX KILLER. {t('footerContent.rights')}</p>
          <Button
            onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
            variant='outline'
            className='bg-primary h-[42px] w-[177px] rounded-[60px] px-[45px] py-[13px] text-sm hover:border-primary-500 hover:bg-primary-500 hover:text-gray-50 active:border-primary-600 active:bg-primary-600 active:duration-0'
          >
            {t('buttons.backToTop')}
          </Button>
        </div>
      </div>
    </footer>
  )
}
