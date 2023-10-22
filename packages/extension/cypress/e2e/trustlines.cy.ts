/// <reference types="cypress" />

import { Network, NETWORK } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

beforeEach(() => {
  // Mock the localStorage with a wallet already loaded
  cy.window().then((win) => {
    win.localStorage.setItem(
      'wallets',
      'U2FsdGVkX19VA07d7tVhAAtUbt+YVbw0xQY7OZMykOW4YI4nRZK9iZ7LT3+xHvrj4kwlPKEcRg0S1GjbIWSFaMzg3Mw8fklZrZLL9QZvnbF821SeDB5lBBj/F9PBg8A07uZhYz1p4sTDsWAOFvrnKJjmlWIqXzN5MFFbWBb3os2xGtAGTslFVUXuTp6eM9X9'
    );
    win.localStorage.setItem(
      'network',
      JSON.stringify({
        name: NETWORK[Network.TESTNET].name
      })
    );
  });
});

// deepcode ignore NoHardcodedPasswords: password used for testing purposes
const PASSWORD = 'SECRET_PASSWORD';
const STORAGE_KEY = '1693425372955.3833';
const URL = `http://localhost:3000/add-new-trustline?storageKey=${STORAGE_KEY}&id=210405959&requestMessage=undefined&transaction=trustSet`;

describe('Trustline', () => {
  const CURRENCY = 'USD';
  const DESTINATION_ADDRESS = 'rwtDvu9QDfCskWuyE2TSEt3s56RbiWUKJN';
  const VALUE = '10000000';
  const AMOUNT = JSON.stringify({
    currency: CURRENCY,
    value: VALUE,
    issuer: DESTINATION_ADDRESS
  });
  const FLAGS = JSON.stringify({
    tfSetNoRipple: true
  });

  it("Reject the trustline's warning", () => {
    const params = {
      limitAmount: AMOUNT,
      flags: FLAGS,
      inAppCall: true
    };

    navigate(URL, PASSWORD, STORAGE_KEY, params);

    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    // Should be on the Warning Trustline Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Trustline');

    // Should have the proper information
    cy.get('h1[data-testid="page-title"]')
      .next()
      .should(
        'have.text',
        'WarningGemWallet does not recommend or support any particular token or issuer.It is important to add only the tokens and issuers you trust.Continue at your own risk'
      );

    // Reject the trustline
    cy.contains('button', 'Reject').click();
    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction rejected');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'Your transaction failed, please try again.Something went wrong'
    );
  });

  it('Confirm the trustline', () => {
    navigate(URL, PASSWORD);

    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    validateTrustlineTx(DESTINATION_ADDRESS, CURRENCY, '10,000,000');
  });

  it('Reject the trustline', () => {
    navigate(URL, PASSWORD);

    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });

    // Should be on the Warning Trustline Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Trustline');

    // Should have the proper information
    cy.get('h1[data-testid="page-title"]')
      .next()
      .should(
        'have.text',
        'WarningGemWallet does not recommend or support any particular token or issuer.It is important to add only the tokens and issuers you trust.Continue at your own risk'
      );

    // Confirm the trustline warning
    cy.contains('button', 'Continue').click();

    // Should be on the Add Trustline Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Trustline');

    // Should have the proper information
    cy.contains('Limit Amount').next().should('have.text', `10,000,000 ${CURRENCY}`);
    cy.contains('p', 'Trustline').next().should('have.text', DESTINATION_ADDRESS);

    // Confirm the trustline
    cy.contains('button', 'Reject').click();

    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction rejected');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'Your transaction failed, please try again.Something went wrong'
    );
  });

  it('Confirm SOLO (non hex)', () => {
    const amount = JSON.stringify({
      currency: 'SOLO',
      value: '10000000',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN'
    });

    const params = {
      limitAmount: amount,
      flags: FLAGS,
      inAppCall: true
    };

    navigate(URL, PASSWORD, STORAGE_KEY, params);

    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    validateTrustlineTx('rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN', 'SOLO', '10,000,000');
  });

  it('Confirm SOLO (hex)', () => {
    const amount = JSON.stringify({
      currency: '534F4C4F00000000000000000000000000000000',
      value: '10000000',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN'
    });

    const params = {
      limitAmount: amount,
      flags: FLAGS,
      inAppCall: true
    };

    navigate(URL, PASSWORD, STORAGE_KEY, params);

    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    validateTrustlineTx('rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN', 'SOLO', '10,000,000');
  });

  const testCases = [
    {
      issuer: 'rwtDvu9QDfCskWuyE2TSEt3s56RbiWUKJN',
      token: 'USD',
      limit: '10000000',
      formattedLimit: '10,000,000'
    },
    {
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
      token: 'SOLO',
      limit: '100000000',
      formattedLimit: '100,000,000'
    }
  ];

  testCases.forEach((testCase) => {
    it(`Set a trustline from the UI with ${testCase.token}`, () => {
      navigate('http://localhost:3000', PASSWORD);

      cy.contains('button', 'Add trustline').click();

      // Should be on the Add Trustline Page
      cy.contains('Add trustline');

      // Fill the form
      cy.get('input[id="issuer"]').type(testCase.issuer);

      cy.get('input[name="token"]').type(testCase.token);

      cy.get('input[name="limit"]').type(testCase.limit);

      // Confirm the trustline
      cy.contains('button', 'Add trustline').click();

      validateTrustlineTx(testCase.issuer, testCase.token, testCase.formattedLimit);
    });
  });

  it(`Search for a trustline from the UI`, () => {
    navigate('http://localhost:3000', PASSWORD);

    cy.contains('button', 'Add trustline').click();

    // Should be on the Add Trustline Page
    cy.get('p').should('have.text', 'Add trustline');

    // Because we are on the testnet, "Search token" text should not exist
    cy.contains('Search token').should('not.exist');
  });

  it('Edit the trustline by disabling No Ripple', () => {
    const newLimit = '5';
    navigate('http://localhost:3000', PASSWORD);

    // Find the trustline to edit
    cy.contains(CURRENCY).closest('.MuiPaper-root').find('button').contains('Edit').click();

    // Change the limit
    cy.get('input[name="limit"]').clear();
    cy.get('input[name="limit"]').type(newLimit);

    // Change the rippling
    cy.get('input[name="noRipple"]').should('be.checked'); // No Ripple is initially true
    cy.get('input[name="noRipple"]').uncheck();

    // Confirm the trustline
    cy.contains('button', 'Edit trustline').click();

    // Continue
    cy.contains('button', 'Continue').click();

    // Check values in the confirmation page
    cy.contains('Limit Amount').next().should('have.text', `${newLimit} ${CURRENCY}`);
    cy.contains('p', 'Trustline').next().should('have.text', DESTINATION_ADDRESS);

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

    // Close
    cy.contains('button', 'Close').click();

    // Check that the trustline was updated
    cy.contains(CURRENCY).closest('.MuiPaper-root').find('button').contains('Edit').click();

    cy.get('input[name="limit"]').should('have.value', '5');
    cy.get('input[name="noRipple"]').should('not.be.checked');
  });
});

const validateTrustlineTx = (destinationAddress: string, currency: string, limit: string) => {
  // Should be on the Warning Trustline Page
  cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Trustline');

  // Should have the proper information
  cy.get('h1[data-testid="page-title"]')
    .next()
    .should(
      'have.text',
      'WarningGemWallet does not recommend or support any particular token or issuer.It is important to add only the tokens and issuers you trust.Continue at your own risk'
    );

  // Confirm the trustline warning
  cy.contains('button', 'Continue').click();

  // Should be on the Add Trustline Page
  cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Trustline');

  // Should have the proper information
  cy.contains('Limit Amount').next().should('have.text', `${limit} ${currency}`);
  cy.contains('p', 'Trustline').next().should('have.text', destinationAddress);

  // Confirm the trustline
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
};
