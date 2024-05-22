/// <reference types="cypress" />

import { xrpToDrops } from 'xrpl';

import { Chain, XRPLNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

const PASSWORD = Cypress.env('PASSWORD');
const LOCAL_STORAGE_WALLETS = Cypress.env('LOCAL_STORAGE_WALLETS');
const ISSUER_ETH_ADDRESS = Cypress.env('ISSUER_ETH_ADDRESS');
const ISSUER_SOLO_ADDRESS = Cypress.env('ISSUER_SOLO_ADDRESS');
const STORAGE_KEY = '1693425372955.3833';
const URL = `http://localhost:3000/transaction?storageKey=${STORAGE_KEY}&id=210405959&requestMessage=REQUEST_SEND_PAYMENT%2FV3&transaction=payment`;

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

describe('Make payment - XRP', () => {
  const AMOUNT = '0.01';
  const params = {
    amount: xrpToDrops(AMOUNT),
    destination: ISSUER_SOLO_ADDRESS
  };

  it('Confirm the payment', () => {
    navigate(URL, PASSWORD, STORAGE_KEY, params);

    cy.on('uncaught:exception', () => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Send Payment');

    // Should have the proper information
    cy.contains('Destination').next().should('have.text', ISSUER_SOLO_ADDRESS);
    cy.contains('Amount').next().should('have.text', `${AMOUNT} XRP`);

    // Confirm the payment
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

  it('Reject the payment', () => {
    navigate(URL, PASSWORD, STORAGE_KEY, params);

    cy.on('uncaught:exception', () => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Send Payment');

    // Should have the proper information
    cy.contains('Destination').next().should('have.text', ISSUER_SOLO_ADDRESS);
    cy.contains('Amount').next().should('have.text', `${AMOUNT} XRP`);

    // Reject the payment
    cy.contains('button', 'Reject').click();
    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction rejected');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'Your transaction failed, please try again.Something went wrong'
    );
  });
});

describe('Make payment - ETH', () => {
  const TOKEN = 'ETH';
  const VALUE = '0.01';
  const AMOUNT = JSON.stringify({
    currency: TOKEN,
    value: VALUE,
    issuer: ISSUER_ETH_ADDRESS
  });

  const params = {
    amount: AMOUNT,
    destination: ISSUER_SOLO_ADDRESS
  };

  it('Confirm the payment', () => {
    navigate(URL, PASSWORD, STORAGE_KEY, params);

    cy.on('uncaught:exception', () => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Send Payment');

    // Should have the proper information
    cy.contains('Destination').next().should('have.text', ISSUER_SOLO_ADDRESS);
    cy.contains('Amount').next().should('have.text', `${VALUE} ${TOKEN}`);
    cy.contains('Trustline').next().should('have.text', ISSUER_ETH_ADDRESS);

    // Confirm the payment
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

  it('Reject the payment', () => {
    navigate(URL, PASSWORD, STORAGE_KEY, params);

    cy.on('uncaught:exception', () => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Send Payment');

    // Should have the proper information
    cy.contains('Destination').next().should('have.text', ISSUER_SOLO_ADDRESS);
    cy.contains('Amount').next().should('have.text', `${VALUE} ${TOKEN}`);
    cy.contains('Trustline').next().should('have.text', ISSUER_ETH_ADDRESS);

    // Reject the payment
    cy.contains('button', 'Reject').click();
    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction rejected');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'Your transaction failed, please try again.Something went wrong'
    );
  });
});

describe('Make payment - SOLO', () => {
  it('Check the payment information (non hex)', () => {
    const TOKEN = 'SOLO';
    const VALUE = '0.01';
    const AMOUNT = JSON.stringify({
      currency: TOKEN,
      value: VALUE,
      issuer: ISSUER_SOLO_ADDRESS
    });

    const params = {
      amount: AMOUNT,
      destination: ISSUER_SOLO_ADDRESS
    };

    navigate(URL, PASSWORD, STORAGE_KEY, params);

    cy.on('uncaught:exception', () => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Send Payment');

    // Should have the proper information
    cy.contains('Destination').next().should('have.text', ISSUER_SOLO_ADDRESS);
    cy.contains('Amount').next().should('have.text', `${VALUE} ${TOKEN}`);
    cy.contains('Trustline').next().should('have.text', ISSUER_SOLO_ADDRESS);
  });

  it('Check the payment information (hex)', () => {
    const TOKEN = '534F4C4F00000000000000000000000000000000';
    const VALUE = '0.01';
    const AMOUNT = JSON.stringify({
      currency: TOKEN,
      value: VALUE,
      issuer: ISSUER_SOLO_ADDRESS
    });

    const params = {
      amount: AMOUNT,
      destination: ISSUER_SOLO_ADDRESS
    };

    navigate(URL, PASSWORD, STORAGE_KEY, params);

    cy.on('uncaught:exception', () => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Send Payment');

    // Should have the proper information
    cy.contains('Destination').next().should('have.text', ISSUER_SOLO_ADDRESS);
    cy.contains('Amount').next().should('have.text', `${VALUE} SOLO`);
    cy.contains('Trustline').next().should('have.text', ISSUER_SOLO_ADDRESS);
  });
});

describe('Make payment from the UI', () => {
  it('Should fill in the payment details and submit', () => {
    navigate('http://localhost:3000', PASSWORD);

    cy.contains('button', 'Send').click();

    // Input recipient's address
    cy.get('#recipient-address').type(ISSUER_SOLO_ADDRESS);

    // Input wrong amount
    cy.get('#amount').type('0.0000001');

    // Button should be disabled
    cy.get('button').contains('Send Payment').should('be.disabled');

    // Input amount
    cy.get('#amount').clear().type('0.01').should('not.have.class', 'Mui-error');

    // Input memo (optional)
    cy.get('#memo').type('Some memo here...').should('not.have.class', 'Mui-error');

    // Input destination tag (optional)
    cy.get('#destination-tag').type('12345').should('not.have.class', 'Mui-error');

    // Click on the Send Payment button
    cy.get('button').contains('Send Payment').click();

    // Confirm the payment
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
