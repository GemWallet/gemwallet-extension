/// <reference types="cypress" />

describe('Send Token', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';

  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem(
        'wallets',
        'U2FsdGVkX19VA07d7tVhAAtUbt+YVbw0xQY7OZMykOW4YI4nRZK9iZ7LT3+xHvrj4kwlPKEcRg0S1GjbIWSFaMzg3Mw8fklZrZLL9QZvnbF821SeDB5lBBj/F9PBg8A07uZhYz1p4sTDsWAOFvrnKJjmlWIqXzN5MFFbWBb3os2xGtAGTslFVUXuTp6eM9X9'
      );
      win.localStorage.setItem('network', 'Testnet');
    });
    cy.visit('http://localhost:3000/');

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();

    // Go to the send page
    cy.contains('button', 'Send').click();
  });

  it('Send XRP', () => {
    // Add receipient address
    cy.get('input[name="recipient-address"]').type('rheBcnFv4FcQpccJNcQVS3jZKJE4RWcxW3');

    // Add amount
    cy.get('input[name="amount"]').type('0.001');

    // Click on send payment button
    cy.contains('button', 'Send Payment').click();

    // Confirm the payment
    cy.contains('button', 'Confirm').click();

    // Make sure the transaction was successful
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

  it('Send USD', () => {
    // Add receipient address
    cy.get('input[name="recipient-address"]').type('rheBcnFv4FcQpccJNcQVS3jZKJE4RWcxW3');

    // Select USD token
    cy.get('#token-select').click();
    cy.contains('li', 'USD').click();

    // Add amount
    cy.get('input[name="amount"]').type('0.001');

    // Click on send payment button
    cy.contains('button', 'Send Payment').click();

    // Confirm the payment
    cy.contains('button', 'Confirm').click();

    // Make sure the transaction was successful
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

  it('Reject Send XRP', () => {
    // Add receipient address as the sender address
    cy.get('input[name="recipient-address"]').type('rB3JmRd5m292YjCsCr65tc8dwZz2WN7HQu');

    // Expect an error if the user sends to himself
    cy.get('p#recipient-address-helper-text').should(
      'have.text',
      'You cannot make a payment to yourself'
    );

    // Add receipient address as a wrong address
    cy.get('input[name="recipient-address"]').clear().type('ABCD');

    // Expect an error if the user sends to himself
    cy.get('p#recipient-address-helper-text').should(
      'have.text',
      'Your destination address is invalid'
    );

    // Add an amount above what the wallet owns
    cy.get('input[name="amount"]').type('9999999999999999');

    // Expect an error if the user inputs an amount greater than the wallet balance
    cy.get('p#amount-helper-text').should(
      'have.text',
      'You do not have enough funds to send this amount'
    );

    // Add the amount to 0
    cy.get('input[name="amount"]').clear().type('0');

    // Expect an error if the user inputs 0 in the amount
    cy.get('p#amount-helper-text').should(
      'have.text',
      'You can only send an amount greater than zero'
    );

    //Add a valid amount and a valid receipient address
    cy.get('input[name="recipient-address"]').clear().type('rheBcnFv4FcQpccJNcQVS3jZKJE4RWcxW3');
    cy.get('input[name="amount"]').clear().type('0.001');

    // Click on send payment button
    cy.contains('button', 'Send Payment').click();

    // Reject the payment
    cy.contains('button', 'Reject').click();

    // Make sure the transaction was successful
    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction rejected');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'Your transaction failed, please try again.'
    );
  });
});
