import type { SVGProps } from 'react';

export function CirclePlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="17.0002" cy="17" r="14.1667" stroke="#292C6D" strokeWidth="1.5"/>
      <path d="M21.25 17L17 17M17 17L12.75 17M17 17L17 12.75M17 17L17 21.25" stroke="#292C6D" strokeWidth="1.5"
            strokeLinecap="round"/>
    </svg>
  );
}
