import { FC, useMemo } from 'react';

import { APPROVED_TOKENS } from '../../../../constants';
import { useNetwork } from '../../../../contexts';
import { GemWallet } from '../GemWallet';

export interface CommunityTokenProps {
  currency: string;
  issuer: string;
}

export const CommunityToken: FC<CommunityTokenProps> = ({ currency, issuer }) => {
  const { network } = useNetwork();

  const webpSupported =
    typeof window !== 'undefined' &&
    window?.HTMLPictureElement &&
    window?.document?.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') ===
      0;

  const isTokenApproved = useMemo(
    (): boolean =>
      APPROVED_TOKENS[network === 'Testnet' ? 'testnet' : 'mainnet'].some(
        (token) => token.issuer === issuer && token.currency === currency
      ),
    [currency, issuer, network]
  );

  if (isTokenApproved && webpSupported) {
    return (
      <picture>
        <source srcSet={`/tokens/${currency}.webp`} type="image/webp" />
        <img
          src={`/tokens/${currency}`}
          alt={currency}
          style={{ height: '45px', width: '45px', borderRadius: '50%' }}
        />
      </picture>
    );
  }
  return <GemWallet />;
};
