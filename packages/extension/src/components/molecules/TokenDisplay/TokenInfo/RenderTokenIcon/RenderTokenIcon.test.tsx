import { render, screen } from '@testing-library/react';

import { RenderTokenIcon } from './RenderTokenIcon';

describe('RenderTokenIcon', () => {
  test('should render Xrp icon when isMainToken is true', () => {
    render(<RenderTokenIcon isMainToken={true} tokenIconUrl="" token="XRP" />);
    expect(screen.getByTestId('xrp-icon')).toBeInTheDocument();
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
});
