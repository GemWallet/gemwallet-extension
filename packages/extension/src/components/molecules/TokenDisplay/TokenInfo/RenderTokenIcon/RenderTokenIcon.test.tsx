import { render, screen } from '@testing-library/react';

import { XAH_TOKEN } from '../../../../../constants';
import { useMainToken } from '../../../../../hooks';
import { RenderTokenIcon } from './RenderTokenIcon';

jest.mock('../../../../../hooks', () => ({
  useMainToken: jest.fn()
}));

describe('RenderTokenIcon', () => {
  test('should render Xrp icon when isMainToken is true', () => {
    render(<RenderTokenIcon isMainToken={true} tokenIconUrl="" token="XRP" />);
    expect(screen.getByTestId('xrp-icon')).toBeInTheDocument();
  });

  test('should render LP token icon when isLPToken is true', () => {
    render(<RenderTokenIcon isLPToken={true} tokenIconUrl="" token="abc" />);
    expect(screen.getByTestId('lp-token-icon')).toBeInTheDocument();
  });

  test('should render an image when tokenIconUrl is provided', () => {
    const tokenIconUrl = 'https://example.com/token.png';
    const token = 'Token';
    const { container } = render(
      <RenderTokenIcon isMainToken={false} tokenIconUrl={tokenIconUrl} token={token} />
    );
    const imgElement = container.querySelector('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', tokenIconUrl);
    expect(imgElement).toHaveAttribute('alt', token);
  });

  test('should render GemWallet when neither isMainToken nor tokenIconUrl is provided', () => {
    render(<RenderTokenIcon isMainToken={false} tokenIconUrl="" token="" />);
    expect(screen.getByTestId('gem-icon')).toBeInTheDocument();
  });

  test('should render Xahau icon when XAH_TOKEN is the main token', () => {
    (useMainToken as jest.Mock).mockReturnValue(XAH_TOKEN);
    render(<RenderTokenIcon isMainToken={true} tokenIconUrl="" token="" />);
    expect(screen.getByTestId('xahau-icon')).toBeInTheDocument();
  });

  test('should render GemWallet by default', () => {
    render(<RenderTokenIcon tokenIconUrl="" token="" />);
    expect(screen.getByTestId('gem-icon')).toBeInTheDocument();
  });

  test('should render LPToken icon when isLPToken is true', () => {
    render(<RenderTokenIcon isLPToken={true} tokenIconUrl="" token="" />);
    expect(screen.getByTestId('lp-token-icon')).toBeInTheDocument();
  });
});
