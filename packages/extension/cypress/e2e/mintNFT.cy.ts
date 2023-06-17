/// <reference types="cypress" />

import { formatFlags } from '../../src/utils';

describe('Mint', () => {
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
    cy.visit(
      `http://localhost:3000?mint-nft?URI=4d696e746564207468726f7567682047656d57616c6c657421&flags=%7B%22tfOnlyXRP%22%3Atrue%2C%22tfTransferable%22%3Atrue%7D&fee=199&transferFee=3000&NFTokenTaxon=0&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210324818&requestMessage=undefined&transaction=mintNFT`,
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

  it('Mint NFT', () => {
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    cy.contains('Transfer Fee:').next().should('have.text', '3%');
    cy.contains('NFT Taxon:').next().should('have.text', '0');
    cy.contains('Memos:').next().should('have.text', 'Test memo');
    cy.contains('Flags:')
      .next()
      .should('have.text', formatFlags({ tfOnlyXRP: true, tfTransferable: true }));
    cy.contains('Network fees:').next().should('have.text', '0.000199 XRP (MANUAL)');
    cy.contains('Memos:').next().should('have.text', 'Test memo');

    // Confirm
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
});
