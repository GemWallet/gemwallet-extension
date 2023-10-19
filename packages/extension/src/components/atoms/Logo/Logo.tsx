import { FC, SVGProps, useMemo } from 'react';

import { useFeatureFlags } from '../../../hooks';

interface LogoProps extends SVGProps<SVGSVGElement> {
  isAnimated?: boolean;
}

export const Logo: FC<LogoProps> = ({ isAnimated, ...rest }) => {
  const { featureFlags } = useFeatureFlags();

  const colors = useMemo(() => {
    if ((featureFlags as any)['CITROUILLE_2K23']) {
      return {
        primary: '#FF7518',
        secondary: '#FFA500',
        tertiary: '#FFD700'
      };
    }
    //TODO: In another MR these colors will need to come from the template
    return {
      primary: '#00A8EA',
      secondary: '#33D3F4',
      tertiary: '#40EEFF'
    };
  }, [featureFlags]);

  if (isAnimated) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="emDoUNTzlg81"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        viewBox="0 0 38.815 39.2"
        width={40}
        height={40}
        {...rest}
      >
        <style>
          {
            '@keyframes emDoUNTzlg85_c_o{0%,to{opacity:1}50%{opacity:.62}}@keyframes emDoUNTzlg88_c_o{0%,to{opacity:.1}50%{opacity:1}}@keyframes emDoUNTzlg89_c_o{0%,to{opacity:.1}50%{opacity:1}}@keyframes emDoUNTzlg810_c_o{0%,to{opacity:.65}50%{opacity:1}}@keyframes emDoUNTzlg811_c_o{0%,to{opacity:1}50%{opacity:.56}}'
          }
        </style>
        <path
          fill={colors.primary}
          d="M20 34.578.593 12.088h38.814z"
          style={{
            animation: 'emDoUNTzlg85_c_o 2000ms linear infinite normal forwards'
          }}
          transform="translate(-.593 4.622)"
        />
        <path fill={colors.secondary} d="M32.593 4.622H6.223L0 16.712h38.815z" />
        <path fill={colors.tertiary} d="M19.407 39.2 12.37 16.711h14.074z" />
        <path
          fill={colors.tertiary}
          d="M14.222 14.4 8.667 5.333H20z"
          opacity={0.1}
          style={{
            animation: 'emDoUNTzlg88_c_o 2000ms linear infinite normal forwards'
          }}
          transform="translate(-.593 -.711)"
        />
        <path
          fill={colors.tertiary}
          d="M25.481 14.4 20 5.333h11.333z"
          opacity={0.1}
          style={{
            animation: 'emDoUNTzlg89_c_o 2000ms linear infinite normal forwards'
          }}
          transform="translate(-.593 -.711)"
        />
        <path
          fill="#fff"
          d="M6.296 6.489 3.407 5.333l2.89-1.155L7.258.71l.963 3.467 2.89 1.155-2.89 1.156-.963 3.467z"
          opacity={0.65}
          style={{
            animation: 'emDoUNTzlg810_c_o 2000ms linear infinite normal forwards'
          }}
          transform="translate(-.593 -.711)"
        />
        <path
          fill="#fff"
          d="m33.704 17.778-1.852-.711 1.852-.8.666-2.223.593 2.223 1.852.8-1.852.71L34.37 20z"
          style={{
            animation: 'emDoUNTzlg811_c_o 2000ms linear infinite normal forwards'
          }}
          transform="translate(-.593 -.711)"
        />
        <g opacity={0.2}>
          <path
            fill="#fff"
            d="M21.26 4.622 5.703 23.378 4.37 21.867 18.74 4.622zM30 4.622 10.148 28.444 7.037 24.89 23.852 4.622z"
          />
        </g>
      </svg>
    );
  }
  return (
    <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <g fill="none">
        <path fill={colors.primary} d="M20 39.911.593 17.422h38.814z" />
        <path fill={colors.secondary} d="M33.185 5.333H6.815L.593 17.423h38.814z" />
        <path
          fill={colors.tertiary}
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
};
