import type { SVGProps } from 'react'

export function ProfileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <circle cx='9' cy='4.5' r='3' fill='currentColor' />
      <ellipse cx='9' cy='12.75' rx='5.25' ry='3' fill='currentColor' />
    </svg>
  )
}
