describe('Offers', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';
  const CREATE_OFFER_URL = `http://localhost:3000?create-offer&takerGets=10000000&takerPays=%7B%22currency%22%3A%22ETH%22%2C%22issuer%22%3A%22rnm76Qgz4G9G4gZBJVuXVvkbt7gVD7szey%22%2C%22value%22%3A%220.1%22%7D&flags=%7B%22tfPassive%22%3Atrue%7D&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210328024&requestMessage=undefined&transaction=createOffer`;
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

  it('Create offer', () => {
    navigate(CREATE_OFFER_URL, PASSWORD);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    cy.contains('Taker gets:').next().should('have.text', '10 XRP');
    cy.contains('Taker pays:').next().should('have.text', '0.1 ETH');
    cy.contains('Network fees:').next().should('have.text', '0.000199 XRP (MANUAL)');
    cy.contains('Memos:').next().should('have.text', 'Test memo');
    cy.contains('Flags:').next().should('have.text', 'tfPassive: true');

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
