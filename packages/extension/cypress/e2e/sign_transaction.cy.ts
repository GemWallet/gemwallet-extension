describe('Submit Transaction', () => {
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
  });

  it('Submit Transaction', () => {
    const url = `http://localhost:3000?submit-transaction&transaction=%7B%22TransactionType%22%3A%22Payment%22%2C%22Destination%22%3A%22rhikRdkFw28csKw9z7fVoBjWncz1HSoQij%22%2C%22Amount%22%3A%22100000%22%7D&id=210329246&requestMessage=undefined&submit=transaction`;
    navigate(url, PASSWORD);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    cy.contains('Transaction:')
      .next()
      .should(
        'have.text',
        '{"TransactionType":"Payment""Destination":"rhikRdkFw28csKw9z7fVoBjWncz1HSoQij""Amount":"100000""Account":"rB3JmRd5m292YjCsCr65tc8dwZz2WN7HQu"}'
      );

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

  const navigate = (url: string, password: string) => {
    cy.visit(url, {
      onBeforeLoad(win) {
        (win as any).chrome = (win as any).chrome || {};
        (win as any).chrome.runtime = {
          sendMessage(message, cb) {}
        };
      }
    });

    // Login
    cy.get('input[name="password"]').type(password);
    cy.contains('button', 'Unlock').click();
  };
});
