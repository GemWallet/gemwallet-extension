import { Chain, XRPLNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

const URL =
  'http://localhost:3000/sign-transaction?storageKey=1693425372955.3833&id=210401828&requestMessage=undefined&sign=transaction';

const PASSWORD = Cypress.env('password');
const LOCAL_STORAGE_WALLETS = Cypress.env('localStorage');
const ISSUER_SOLO_ADDRESS = Cypress.env('issuerSOLOAddress');
const DEFAULT_WALLET_ADDRESS = Cypress.env('defaultWalletAddress');

describe('Sign Transaction', () => {
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
  });

  it('Sign Transaction', () => {
    const transaction = {
      TransactionType: 'Payment',
      Destination: 'rhikRdkFw28csKw9z7fVoBjWncz1HSoQij',
      Amount: '100000'
    };

    navigate(URL, PASSWORD, '1693425372955.3833', { transaction });

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Sign Transaction');

    cy.contains(
      `{"TransactionType":"Payment""Destination":"rhikRdkFw28csKw9z7fVoBjWncz1HSoQij""Amount":"100000""Account":"${DEFAULT_WALLET_ADDRESS}"}`
    );

    // Confirm
    cy.contains('button', 'Sign').click();

    cy.get('h1[data-testid="transaction-title"]').contains('Transaction accepted', {
      timeout: 10000
    });
    cy.get('p[data-testid="transaction-subtitle"]').should('have.text', 'Transaction Successful');
  });

  it('Sign Transaction (Set Trustline SOLO 1000000)', () => {
    const transaction = {
      TransactionType: 'TrustSet',
      LimitAmount: {
        currency: '534F4C4F00000000000000000000000000000000',
        issuer: ISSUER_SOLO_ADDRESS,
        value: '10000000'
      },
      Memos: [
        {
          Memo: {
            MemoType: '4465736372697074696f6e',
            MemoData: '54657374206d656d6f'
          }
        }
      ],
      Fee: '199'
    };
    navigate(URL, PASSWORD, '1693425372955.3833', { transaction });

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Sign Transaction');

    cy.contains(
      `{"TransactionType":"TrustSet""LimitAmount":{"currency":"534F4C4F00000000000000000000000000000000""issuer":"${ISSUER_SOLO_ADDRESS}""value":"10000000"}"Memos":[0:{"Memo":{"MemoType":"4465736372697074696f6e""MemoData":"54657374206d656d6f"}}]"Fee":"199""Account":"${DEFAULT_WALLET_ADDRESS}"}`
    );

    cy.contains('Transaction Type').next().should('have.text', 'TrustSet');
    cy.contains('Limit Amount').next().should('have.text', '10,000,000 SOLO');
    cy.contains('Trustline').next().should('have.text', ISSUER_SOLO_ADDRESS);
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Network fees').next().should('have.text', '0.000199 XRP (MANUAL)');

    // Confirm
    cy.contains('button', 'Sign').click();

    cy.get('h1[data-testid="transaction-title"]').contains('Transaction accepted', {
      timeout: 10000
    });
    cy.get('p[data-testid="transaction-subtitle"]').should('have.text', 'Transaction Successful');
  });
});
