/// <reference types="cypress" />

describe('Trustline', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';
  const CURRENCY = 'USD';
  const DESTINATION_ADDRESS = 'rwtDvu9QDfCskWuyE2TSEt3s56RbiWUKJN';
  const VALUE = '10000000';

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
      `http://localhost:3000?currency=${CURRENCY}&issuer=${DESTINATION_ADDRESS}&value=${VALUE}&id=93376196&transaction=trustSet`,
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

  it("Reject the trustline's warning", () => {
    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    // Should be on the Warning Trustline Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Add Trustline');

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
    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });
    // Should be on the Warning Trustline Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Add Trustline');

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
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Add Trustline - Confirm');

    // Should have the proper information
    cy.contains('Issuer:').next().should('have.text', DESTINATION_ADDRESS);
    cy.contains('Currency:').next().should('have.text', CURRENCY);
    cy.contains('Limit:').next().should('have.text', `10,000,000 ${CURRENCY}`);
    cy.contains('Fees:').next().should('have.text', '0 XRP');

    // Confirm the trustline
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

  it('Reject the trustline', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      // Continue with the test
      return false;
    });

    // Should be on the Warning Trustline Page
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Add Trustline');

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
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Add Trustline - Confirm');

    // Should have the proper information
    cy.contains('Issuer:').next().should('have.text', DESTINATION_ADDRESS);
    cy.contains('Currency:').next().should('have.text', CURRENCY);
    cy.contains('Limit:').next().should('have.text', `10,000,000 ${CURRENCY}`);
    cy.contains('Fees:').next().should('have.text', '0 XRP');

    // Confirm the trustline
    cy.contains('button', 'Reject').click();

    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction rejected');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'Your transaction failed, please try again.Something went wrong'
    );
  });
});
