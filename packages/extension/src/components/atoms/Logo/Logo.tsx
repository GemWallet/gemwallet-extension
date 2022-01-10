import { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none">
      <path fill="#00A8EA" d="M20 39.911.593 17.422h38.814z" />
      <path fill="#33D3F4" d="M33.185 5.333H6.815L.593 17.423h38.814z" />
      <path
        fill="#40EEFF"
        d="m20 39.911-7.037-22.489h14.074zM14.222 14.4 8.667 5.333H20zm11.259 0L20 5.333h11.333z"
      />
      <path
        fill="#FFF"
        d="M6.296 6.489 3.407 5.333l2.89-1.155L7.258.71l.963 3.467 2.89 1.155-2.89 1.156-.963 3.467zm27.408 11.289-1.852-.711 1.852-.8.666-2.223.593 2.223 1.852.8-1.852.71L34.37 20z"
      />
      <path
        d="M21.852 5.333 6.296 24.09l-1.333-1.511 14.37-17.245zm8.741 0L10.74 29.156 7.63 25.6 24.444 5.333z"
        opacity={0.2}
        fill="#FFF"
      />
    </g>
  </svg>
);
