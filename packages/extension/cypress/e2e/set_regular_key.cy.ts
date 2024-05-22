import { Chain, XRPLNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

const PASSWORD = Cypress.env('PASSWORD');
const LOCAL_STORAGE_WALLETS = Cypress.env('LOCAL_STORAGE_WALLETS');
const STORAGE_KEY = '1693425372955.3833';

describe('Set Regular Key', () => {
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

  it('Set Regular Key (API)', () => {
    const url = `http://localhost:3000/set-regular-key?storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=setRegularKey`;
    const params = {
      regularKey: 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o',
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ]
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Regular Key');

    cy.contains('p', 'Regular Key')
      .next()
      .should('have.text', 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o');
    cy.contains('Memo').next().should('have.text', 'Test memo');

    // Confirm
    cy.contains('button', 'Submit').click();

    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction in progress');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'We are processing your transactionPlease wait'
    );

    cy.get('h1[data-testid="transaction-title"]').contains('Transaction accepted', {
      timeout: 10000
    });
    cy.get('p[data-testid="transaction-subtitle"]').should('have.text', 'Transaction Successful');
  });

  it('Set Regular Key (UI)', () => {
    navigate(
      'http://localhost:3000?set-regular-key&inAppCall=true&transaction=setRegularKey',
      PASSWORD
    );

    // Enter wrong Regular Key
    cy.get('input[name="regularKey"]').clear();
    cy.get('input[name="regularKey"]').type('fake');
    cy.get('input[name="regularKey"]').blur();
    cy.get('#regularKey-helper-text').should('have.text', 'The regular key is not a valid address');
    cy.contains('button', 'Submit').should('be.disabled');

    // Enter Regular Key
    cy.get('input[name="regularKey"]').clear();
    cy.get('input[name="regularKey"]').type('rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o');
    cy.contains('button', 'Submit').should('be.enabled');

    // Confirm
    cy.contains('button', 'Submit').click();

    // Check transaction details
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Regular Key', {
      timeout: 10000
    });

    cy.contains('p', 'Regular Key')
      .next()
      .should('have.text', 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o');

    // Confirm
    cy.contains('button', 'Submit').click();

    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction in progress');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'We are processing your transactionPlease wait'
    );

    cy.get('h1[data-testid="transaction-title"]').contains('Transaction accepted', {
      timeout: 10000
    });
    cy.get('p[data-testid="transaction-subtitle"]').should('have.text', 'Transaction Successful');
  });

  it('Delete Regular Key (UI)', () => {
    navigate(
      'http://localhost:3000?set-regular-key&inAppCall=true&transaction=setRegularKey',
      PASSWORD
    );

    // Check the current Regular Key
    cy.get('input[name="regularKey"]').should('have.value', 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o');

    // Check the checkbox
    cy.get('input[name="deleteRegularKey"]').click();
    cy.contains('button', 'Submit').should('be.enabled');

    // Confirm
    cy.contains('button', 'Submit').click();

    // Check transaction details
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Regular Key', {
      timeout: 10000
    });

    // Confirm
    cy.contains('button', 'Submit').click();

    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction in progress');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'We are processing your transactionPlease wait'
    );

    cy.get('h1[data-testid="transaction-title"]').contains('Transaction accepted', {
      timeout: 10000
    });
    cy.get('p[data-testid="transaction-subtitle"]').should('have.text', 'Transaction Successful');
  });
});
