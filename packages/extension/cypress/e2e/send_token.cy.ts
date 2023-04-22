/// <reference types="cypress" />

describe('Send Token', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';

  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem(
        'wallets',
        'U2FsdGVkX1/JAHkPXi6ZonxQukDVxSlHcveDl30pBLB/Y9tPmrtAIi0ulBoj+mgxv/qj29Odgw8pRm0QzwGpT5zKmTRyf4QHmjpl5UcSNfRw95l/ZxPMgOpy/qrOJgWQHKNVK1TUpQHuV/c+ULBmpyOeMsI60paKXKvBEddTfHggacZV9ABvmCZZbIMM4h3tRn0HtVQY8kFvp9yJuUxq8T6BMgHzCys7hzUjtwdZ81YVEfdUShzEkleuqLsx4STqNvibUmf6HnwCgMCCPTzjulr3XvZK+yfreBb3RPsivSCsl5dwSz0ORtNwg04zjLiTvR+1btv91kifEBrMo3dh/Q=='
      );
      win.localStorage.setItem('network', 'Testnet');
    });
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        (win as any).chrome = (win as any).chrome || {};
        (win as any).chrome.runtime = {
          sendMessage(message, cb) {}
        };
      }
    });

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();

    // Go to the send page
    cy.contains('button', 'Send').click();
  });

  it('Cannot send token if the wallet is not activated', () => {
    // Go back to the home page
    cy.get('button[aria-label="close"]').click();

    // Go to the list wallet screen
    cy.get('[aria-label="Wallet icon with green border"]').click();

    // Select the second wallet
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 2);
    cy.get('div[data-testid="wallet-container"]').children().eq(1).click();

    // Check the current wallet
    cy.contains('Wallet 2').should('be.visible');

    // Go to the send page
    cy.contains('button', 'Send').click();

    // Check that the error message is displayed
    cy.get('div[data-testid="wallet-not-activated"]>div>div>p').should(
      'have.text',
      'Wallet not activated'
    );
    cy.get('div[data-testid="wallet-not-activated"]>div')
      .children()
      .eq(1)
      .should('have.text', 'You cannot send a payment because your wallet is not activated');
  });

  it('Send XRP', () => {
    sendXRP();
  });

  it('Send XRP with memo', () => {
    sendXRP('This is a memo');
  });

  it('Send XRP with destination tag', () => {
    sendXRP(undefined, '123456789');
  });

  it('Send USD', () => {
    sendUSD();
  });

  it('Send USD with memo and destination tag', () => {
    sendUSD('This is another memo', '12');
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

    // Add a too large memo
    cy.get('input[name="memo"]').clear().type('a'.repeat(301));

    // Expect an error if the user inputs a too large memo
    cy.get('p#memo-helper-text').should(
      'have.text',
      'Your memo is too long, it cannot exceed 300 characters'
    );

    // Add a too large destination tag
    cy.get('input[name="destination-tag"]').clear().type('1'.repeat(11));

    // Expect an error if the user inputs a too large destination tag
    cy.get('p#destination-tag-helper-text').should(
      'have.text',
      'The destination tag cannot exceed 10 digits'
    );

    // Add a decimal destination tag
    cy.get('input[name="destination-tag"]').clear().type('1.1');

    // Expect an error if the user inputs a decimal destination tag
    cy.get('p#destination-tag-helper-text').should(
      'have.text',
      'The destination tag cannot be a decimal number'
    );

    //Add a valid amount, a valid receipient address and a valid memo
    cy.get('input[name="recipient-address"]').clear().type('rheBcnFv4FcQpccJNcQVS3jZKJE4RWcxW3');
    cy.get('input[name="amount"]').clear().type('0.001');
    cy.get('input[name="memo"]').clear().type('This is a memo');
    cy.get('input[name="destination-tag"]').clear().type('123456789');

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

const sendXRP = (memo?: string, destinationTag?: string) => {
  // Add receipient address
  cy.get('input[name="recipient-address"]').type('rheBcnFv4FcQpccJNcQVS3jZKJE4RWcxW3');

  handleTransaction(memo, destinationTag);
};

const sendUSD = (memo?: string, destinationTag?: string) => {
  // Add receipient address
  cy.get('input[name="recipient-address"]').type('rheBcnFv4FcQpccJNcQVS3jZKJE4RWcxW3');

  // Select USD token
  cy.get('#token-select').click();
  cy.contains('li', 'USD').click();

  handleTransaction(memo, destinationTag);
};

const handleTransaction = (memo?: string, destinationTag?: string) => {
  // Add amount
  cy.get('input[name="amount"]').type('0.001');

  // Add memo
  if (memo) {
    cy.get('input[name="memo"]').type(memo);
  }

  // Add destination tag
  if (destinationTag) {
    cy.get('input[name="destination-tag"]').type(destinationTag);
  }

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

  // Go back to the home page
  cy.contains('button', 'Close').click();

  // Go to the transactions page
  cy.contains('button', 'History').click();

  // Click on the latest transaction
  cy.contains('li', 'Payment sent').first().click();

  // Make sure the transaction details are correct
  cy.contains('Payment sent - 0.001 XRP');

  if (memo) {
    cy.contains('Memo');
    cy.contains(memo);
  } else {
    cy.should('not.contain', 'Memo');
  }
};
