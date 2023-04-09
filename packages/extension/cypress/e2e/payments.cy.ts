/// <reference types="cypress" />

describe('Make payment - XRP', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';
  const AMOUNT = '20';
  const DESTINATION_ADDRESS = 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o';
  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem(
        'wallets',
        'U2FsdGVkX19VA07d7tVhAAtUbt+YVbw0xQY7OZMykOW4YI4nRZK9iZ7LT3+xHvrj4kwlPKEcRg0S1GjbIWSFaMzg3Mw8fklZrZLL9QZvnbF821SeDB5lBBj/F9PBg8A07uZhYz1p4sTDsWAOFvrnKJjmlWIqXzN5MFFbWBb3os2xGtAGTslFVUXuTp6eM9X9'
      );
      win.localStorage.setItem('network', 'Testnet');
    });
    cy.visit(
      `http://localhost:3000?amount=${AMOUNT}&destination=${DESTINATION_ADDRESS}&id=93376012&transaction=payment/`,
      {
        onBeforeLoad(win) {
          (win as any).chrome = (win as any).chrome || {};
          (win as any).chrome.runtime = {
            sendMessage(message, cb) {}
          };
        }
      }
    );

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();
  });

  it('Confirm the payment', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    // Should have the proper information
    cy.contains('Destination:').next().should('have.text', DESTINATION_ADDRESS);
    cy.contains('Amount:').next().should('have.text', `${AMOUNT} XRP`);

    // Confirm the payment
    cy.contains('button', 'Confirm').click();

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
    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    // Should have the proper information
    cy.contains('Destination:').next().should('have.text', DESTINATION_ADDRESS);
    cy.contains('Amount:').next().should('have.text', `${AMOUNT} XRP`);

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
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';
  const TOKEN = 'ETH';
  const AMOUNT = '20';
  const DESTINATION_ADDRESS = 'rnm76Qgz4G9G4gZBJVuXVvkbt7gVD7szey';
  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem(
        'wallets',
        'U2FsdGVkX19VA07d7tVhAAtUbt+YVbw0xQY7OZMykOW4YI4nRZK9iZ7LT3+xHvrj4kwlPKEcRg0S1GjbIWSFaMzg3Mw8fklZrZLL9QZvnbF821SeDB5lBBj/F9PBg8A07uZhYz1p4sTDsWAOFvrnKJjmlWIqXzN5MFFbWBb3os2xGtAGTslFVUXuTp6eM9X9'
      );
      win.localStorage.setItem('network', 'Testnet');
    });
    cy.visit(
      `http://localhost:3000?amount=${AMOUNT}&destination=${DESTINATION_ADDRESS}&currency=${TOKEN}&issuer=${DESTINATION_ADDRESS}&id=93376135&transaction=payment`
    );

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();
  });

  it('Confirm the payment', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    // Should have the proper information
    cy.contains('Destination:').next().should('have.text', DESTINATION_ADDRESS);
    cy.contains('Amount:').next().should('have.text', `${AMOUNT} ${TOKEN}`);

    // Confirm the payment
    cy.contains('button', 'Confirm').click();

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
    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    // Should be on the Confirm Transaction Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    // Should have the proper information
    cy.contains('Destination:').next().should('have.text', DESTINATION_ADDRESS);
    cy.contains('Amount:').next().should('have.text', `${AMOUNT} ${TOKEN}`);

    // Reject the payment
    cy.contains('button', 'Reject').click();
    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction rejected');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'Your transaction failed, please try again.Something went wrong'
    );
  });
});
