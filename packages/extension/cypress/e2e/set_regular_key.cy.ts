import { Network, NETWORK } from '@gemwallet/constants';

describe('Set Regular Key', () => {
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

  it('Set Regular Key (API)', () => {
    cy.visit(
      `http://localhost:3000?set-regular-key&regularKey=rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210384974&requestMessage=undefined&transaction=setRegularKey`,
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

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Regular Key');

    cy.contains('Regular Key:').next().should('have.text', 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o');
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

  it('Set Regular Key (UI)', () => {
    navigate('http://localhost:3000', PASSWORD);

    // Click on settings
    cy.contains('Settings').click();

    // Click on Set Regular Key
    cy.contains('Set Regular Key').click();

    // Enter wrong Regular Key
    cy.get('input[name="regularKey"]').type('fake');
    cy.get('input[name="regularKey"]').blur();
    cy.get('#regularKey-helper-text').should('have.text', 'The regular key is not a valid address');
    cy.contains('button', 'Confirm').should('be.disabled');

    // Enter Regular Key
    cy.get('input[name="regularKey"]').clear();
    cy.get('input[name="regularKey"]').type('rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o');
    cy.contains('button', 'Confirm').should('be.enabled');

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

  it('Delete Regular Key (UI)', () => {
    navigate('http://localhost:3000', PASSWORD);

    // Click on settings
    cy.contains('Settings').click();

    // Click on Set Regular Key
    cy.contains('Set Regular Key').click();

    // Enter wrong Regular Key
    cy.get('input[name="regularKey"]').type('fake');
    cy.get('input[name="regularKey"]').blur();
    cy.get('#regularKey-helper-text').should('have.text', 'The regular key is not a valid address');
    cy.contains('button', 'Confirm').should('be.disabled');

    // Check the checkbox
    cy.get('input[name="deleteRegularKey"]').click();
    cy.contains('button', 'Confirm').should('be.enabled');

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

const navigate = (url: string, password: string) => {
  cy.visit(url, {
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
  });

  // Login
  cy.get('input[name="password"]').type(password);
  cy.contains('button', 'Unlock').click();
};
