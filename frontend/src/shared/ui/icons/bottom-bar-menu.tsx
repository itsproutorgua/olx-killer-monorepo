import type { SVGProps } from 'react'

export function BottomBarMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M25 8.75L5 8.75'
        stroke='#F9FAFB'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M18.75 15L5 15'
        stroke='#F9FAFB'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M11.25 21.25H5'
        stroke='#F9FAFB'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  )
}
