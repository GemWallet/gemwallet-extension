import { Chain, XRPLNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

const SUBMIT_RAW_TRANSACTION_PATH = 'http://localhost:3000/build-transaction?transaction=buildRaw';
const PASSWORD = Cypress.env('password');
const LOCAL_STORAGE_WALLETS = Cypress.env('localStorage');
const ISSUER_SOLO_ADDRESS = Cypress.env('issuerSOLOAddress');

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

describe('JSON Transaction', () => {
  it('Sign JSON Transaction', () => {
    navigate(SUBMIT_RAW_TRANSACTION_PATH, PASSWORD);

    const rawTx = `{
        "TransactionType": "Payment",
        "Destination": "rhikRdkFw28csKw9z7fVoBjWncz1HSoQij",
        "Amount": "100000",
        "Memos": [
            {
                "Memo": {
                    "MemoData": "54657374206D656D6F",
                    "MemoType": "4465736372697074696F6E"
                }
            }
        ]
    }`;

    cy.get('.json-editor').type(rawTx);

    // Type extra character to trigger validation
    cy.get('.json-editor').type('a');

    // Click on 'Sign' button
    cy.get('button').contains('Sign').click();

    // 'Invalid JSON' error should be displayed
    cy.contains('Invalid JSON');

    // Remove extra character
    cy.get('.json-editor').type('{backspace}');

    // Click on 'Sign' button
    cy.get('button').contains('Sign').click();

    // 'Sign Transaction' modal should be displayed
    cy.contains('Sign Transaction');
    cy.contains('Amount').next().should('have.text', '0.1 XRP');

    // Click on 'Sign' button
    cy.get('button').contains('Sign').click();

    cy.get('h1[data-testid="transaction-title"]').contains('Transaction accepted', {
      timeout: 10000
    });
  });

  it('Submit JSON Transaction', () => {
    navigate(SUBMIT_RAW_TRANSACTION_PATH, PASSWORD);

    const rawTx = `{
        "TransactionType": "Payment",
        "Destination": "${ISSUER_SOLO_ADDRESS}",
        "Amount": "100000",
        "Memos": [
            {
                "Memo": {
                    "MemoData": "54657374206D656D6F",
                    "MemoType": "4465736372697074696F6E"
                }
            }
        ]
    }`;

    cy.get('.json-editor').type(rawTx);

    // Type extra character to trigger validation
    cy.get('.json-editor').type('a');

    // Click on 'Submit' button
    cy.get('button').contains('Submit').click();

    // 'Invalid JSON' error should be displayed
    cy.contains('Invalid JSON');

    // Remove extra character
    cy.get('.json-editor').type('{backspace}');

    // Click on 'Submit' button
    cy.get('button').contains('Submit').click();

    // 'Submit Transaction' modal should be displayed
    cy.contains('Submit Transaction');
    cy.contains('Amount').next().should('have.text', '0.1 XRP');

    // Click on 'Submit' button
    cy.get('button').contains('Submit').click();

    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction in progress');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'We are processing your transactionPlease wait'
    );

    cy.get('h1[data-testid="transaction-title"]').contains('Transaction accepted', {
      timeout: 10000
    });
  });
});
