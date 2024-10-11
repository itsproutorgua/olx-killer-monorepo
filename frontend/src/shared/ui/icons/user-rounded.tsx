import type { SVGProps } from 'react'

export function UserRoundedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
      {...props}
    >
      <g fill={props.fill} stroke='currentColor' strokeWidth={1.5}>
        <circle cx={12} cy={6} r={4}></circle>
        <ellipse cx={12} cy={17} rx={7} ry={4}></ellipse>
      </g>
    </svg>
  )
}
