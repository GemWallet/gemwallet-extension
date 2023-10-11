import { Network, NETWORK } from '@gemwallet/constants';

describe('Set Account', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';

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

  it('Set Account', () => {
    cy.visit(
      `http://localhost:3000?emailHash=1D1382344586ECFF844DACFF698C2EFB&fee=199&flags=%7B%22tfAllowXRP%22%3Atrue%7D&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210327555&requestMessage=undefined&transaction=setAccount`,
      {
        onBeforeLoad(win) {
          (win as any).chrome = (win as any).chrome || {};
          (win as any).chrome.runtime = {
            sendMessage(message, cb) {}
          };

          (win as any).chrome.storage = {
            local: {
              get(key, cb) {},
              set(obj, cb) {
                if (cb) cb();
              }
            }
          };

          cy.stub((win as any).chrome.runtime, 'sendMessage').resolves({});
        }
      }
    );

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Account');

    cy.contains('Email Hash').next().should('have.text', '1D1382344586ECFF844DACFF698C2EFB');
    cy.contains('Network fees').next().should('have.text', '0.000199 XRP (MANUAL)');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Allow XRP');
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
