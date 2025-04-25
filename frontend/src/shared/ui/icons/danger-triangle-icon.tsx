import type { SVGProps } from 'react'

export const DangerTriangleIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M12 9V14'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.0004 21.4112H5.94042C2.47042 21.4112 1.02042 18.9312 2.70042 15.9012L5.82042 10.2812L8.76042 5.00125C10.5404 1.79125 13.4604 1.79125 15.2404 5.00125L18.1804 10.2913L21.3004 15.9113C22.9804 18.9413 21.5204 21.4212 18.0604 21.4212H12.0004V21.4112Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.9941 17H12.0031'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
