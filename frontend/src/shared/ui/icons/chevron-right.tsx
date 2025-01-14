import type { SVGProps } from 'react'

export function ChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='7'
      height='13'
      viewBox='0 0 7 13'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-label='Chevron Right'
      {...props}
    >
      <path
        d='M0.641626 13C0.38555 13 0.153582 12.8502 0.0521379 12.6201C-0.0492883 12.39 -8.26866e-05 12.1236 0.176661 11.9425L5.47305 6.50013L0.176661 1.05777C-0.067366 0.807101 -0.0563192 0.40956 0.200762 0.171596C0.458846 -0.066347 0.865549 -0.055576 1.1096 0.196076L6.82451 6.06933C7.0585 6.31217 7.0585 6.69113 6.82451 6.93395L1.1096 12.8042C0.988084 12.9305 0.819372 13.001 0.641626 13Z'
        fill='currentColor'
      />
    </svg>
  )
}
