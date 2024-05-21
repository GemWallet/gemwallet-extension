import { Chain, XRPLNetwork } from '@gemwallet/constants';
import { navigate } from '../utils/navigation';

const PASSWORD = Cypress.env('password');
const LOCAL_STORAGE_WALLETS = Cypress.env('localStorage');

describe('ReceivePayment View', () => {
  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem('wallets', LOCAL_STORAGE_WALLETS);
      win.localStorage.setItem(
        'network',
        JSON.stringify({
          chain: Chain.XRPL,
          name: XRPLNetwork.TESTNET
        })
      );
    });
    navigate('http://localhost:3000/', PASSWORD);

    // Go to the receive page
    cy.contains('button', 'Receive').click();
  });

  it('should display the QRCode and wallet address', () => {
    cy.get('canvas').should('be.visible');

    cy.get('[data-testid="receive-payment-address"]').should('have.text', 'rpeV...7gHu');
  });
});
