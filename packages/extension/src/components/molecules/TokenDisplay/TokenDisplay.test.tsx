import { render, screen, fireEvent } from '@testing-library/react';

import { formatToken } from '../../../utils';
import { TokenDisplay, TokenDisplayProps } from './TokenDisplay';

jest.mock('../../atoms/Tokens/CommunityToken', () => ({
  CommunityToken: () => <div data-testid="gem-icon" />
}));

describe('TokenDisplay', () => {
  let props: TokenDisplayProps;
  beforeEach(() => {
    props = {
      balance: 100,
      token: 'ETH',
      issuer: 'rnm76Qgz4G9G4gZBJVuXVvkbt7gVD7szey',
      onExplainClick: jest.fn()
    };
  });

  test('should display the token name and balance', () => {
    render(<TokenDisplay {...props} />);
    expect(screen.getByText(props.token)).toBeInTheDocument();
    expect(screen.getByText(formatToken(props.balance, props.token))).toBeInTheDocument();
    expect(screen.getByTestId('gem-icon')).toBeInTheDocument();
  });

  test('should display the XRP icon if issuer is undefined', () => {
    render(<TokenDisplay {...props} issuer={undefined} />);
    expect(screen.getByTestId('xrp-icon')).toBeInTheDocument();
  });

  test('should display the "Explain" button if onExplainClick is provided', () => {
    render(<TokenDisplay {...props} />);
    expect(screen.getByText('Explain')).toBeInTheDocument();
  });

  test('should call onExplainClick when the "Explain" button is clicked', () => {
    render(<TokenDisplay {...props} />);
    fireEvent.click(screen.getByText('Explain'));
    expect(props.onExplainClick).toHaveBeenCalled();
  });
});
