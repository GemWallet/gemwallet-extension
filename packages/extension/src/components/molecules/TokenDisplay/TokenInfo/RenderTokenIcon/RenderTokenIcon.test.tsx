import { render, screen } from '@testing-library/react';

import { RenderTokenIcon } from './RenderTokenIcon';

describe('RenderTokenIcon', () => {
  test('should render Xrp icon when isXRPToken is true', () => {
    render(<RenderTokenIcon isXRPToken={true} tokenIconUrl="" token="XRP" />);
    expect(screen.getByTestId('xrp-icon')).toBeInTheDocument();
  });

  test('should render an image when tokenIconUrl is provided', () => {
    const tokenIconUrl = 'https://example.com/token.png';
    const token = 'Token';
    render(<RenderTokenIcon isXRPToken={false} tokenIconUrl={tokenIconUrl} token={token} />);
    const imgElement = screen.getByRole('img', { name: token });
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', tokenIconUrl);
  });

  test('should render GemWallet when neither isXRPToken nor tokenIconUrl is provided', () => {
    render(<RenderTokenIcon isXRPToken={false} tokenIconUrl="" token="" />);
    expect(screen.getByTestId('gem-icon')).toBeInTheDocument();
  });
});
