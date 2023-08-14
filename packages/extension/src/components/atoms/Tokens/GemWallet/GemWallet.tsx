import { FC, SVGProps } from 'react';

export const GemWallet: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width={45} height={45} xmlns="http://www.w3.org/2000/svg" {...props} data-testid="gem-icon">
    <circle cx="22.492" cy="22.51" r="22.363" fill="#1e1e1e" stroke="null" />
    <g fill="none" stroke="null">
      <path fill="#7d7d7d" d="m22.5 34.345-11.448-13.59h22.896L22.5 34.344z" />
      <path fill="#bcbcbc" d="M30.278 13.448H14.722l-3.67 7.307h22.896l-3.67-7.307z" />
      <path
        fill="#c9c9c9"
        d="m22.5 34.345-4.151-13.59h8.302L22.5 34.344zm-3.408-15.417-3.277-5.48H22.5l-3.408 5.48zm6.641 0-3.233-5.48h6.685l-3.452 5.48z"
      />
      <path
        fill="#FFF"
        d="m14.416 14.147-1.704-.699 1.705-.698.567-2.095.568 2.095 1.705.698-1.705.698-.568 2.096-.568-2.095zm16.168 6.822-1.093-.43 1.093-.483.393-1.343.35 1.343 1.092.484-1.093.429-.35 1.343-.392-1.343z"
      />
      <path
        d="m23.592 13.448-9.176 11.336-.786-.913 8.477-10.422h1.485zm5.157 0L17.038 27.846l-1.835-2.15 9.918-12.248h3.628z"
        opacity=".2"
        fill="#FFF"
      />
    </g>
  </svg>
);
