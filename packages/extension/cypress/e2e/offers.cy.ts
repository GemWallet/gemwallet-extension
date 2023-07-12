describe('Offers', () => {
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

  it('Create offer (XRP to ETH)', () => {
    const url = `http://localhost:3000?create-offer&takerGets=10000000&takerPays=%7B%22currency%22%3A%22ETH%22%2C%22issuer%22%3A%22rnm76Qgz4G9G4gZBJVuXVvkbt7gVD7szey%22%2C%22value%22%3A%220.1%22%7D&flags=%7B%22tfPassive%22%3Atrue%7D&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210328024&requestMessage=undefined&transaction=createOffer`;
    navigate(url, PASSWORD);

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

  it('Create offer (XRP to SOLO (non hex))', () => {
    const amount = JSON.stringify({
      currency: 'SOLO',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
      value: '0.1'
    });

    const url = `http://localhost:3000?create-offer&takerGets=10000000&takerPays=${amount}&flags=%7B%22tfPassive%22%3Atrue%7D&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210328024&requestMessage=undefined&transaction=createOffer`;
    navigate(url, PASSWORD);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    cy.contains('Taker gets:').next().should('have.text', '10 XRP');
    cy.contains('Taker pays:').next().should('have.text', '0.1 SOLO');
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

  it('Create offer (SOLO (non hex) to XRP)', () => {
    const amount = JSON.stringify({
      currency: 'SOLO',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
      value: '0.1'
    });

    const url = `http://localhost:3000?create-offer&takerPays=10000000&takerGets=${amount}&flags=%7B%22tfPassive%22%3Atrue%7D&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210328024&requestMessage=undefined&transaction=createOffer`;
    navigate(url, PASSWORD);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    cy.contains('Taker pays:').next().should('have.text', '10 XRP');
    cy.contains('Taker gets:').next().should('have.text', '0.1 SOLO');
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

  it('Create offer (XRP to SOLO (hex))', () => {
    const amount = JSON.stringify({
      currency: '534F4C4F00000000000000000000000000000000',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
      value: '0.1'
    });

    const url = `http://localhost:3000?create-offer&takerGets=10000000&takerPays=${amount}&flags=%7B%22tfPassive%22%3Atrue%7D&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210328024&requestMessage=undefined&transaction=createOffer`;
    navigate(url, PASSWORD);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    cy.contains('Taker gets:').next().should('have.text', '10 XRP');
    cy.contains('Taker pays:').next().should('have.text', '0.1 SOLO');
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

  it('Create offer (SOLO (hex) to XRP)', () => {
    const amount = JSON.stringify({
      currency: '534F4C4F00000000000000000000000000000000',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
      value: '0.1'
    });

    const url = `http://localhost:3000?create-offer&takerPays=10000000&takerGets=${amount}&flags=%7B%22tfPassive%22%3Atrue%7D&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210328024&requestMessage=undefined&transaction=createOffer`;
    navigate(url, PASSWORD);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    cy.contains('Taker pays:').next().should('have.text', '10 XRP');
    cy.contains('Taker gets:').next().should('have.text', '0.1 SOLO');
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

  it('Read the Sequence ID from the transaction history', () => {
    navigate('localhost:3000', PASSWORD);

    // Go to transaction history
    cy.contains('button', 'History').click();

    // Find a mint transaction
    cy.contains('Create offer').closest('.MuiPaper-root').click();

    // Find the NFT Token ID in the transaction details and add it to the URL
    cy.contains('Sequence')
      .next()
      .invoke('text')
      .then((sequence) => {
        cy.wrap(sequence).as('sequence');
      });
  });

  it('Cancel offer', function () {
    navigate(
      `http://localhost:3000?cancel-offer&offerSequence=${this.sequence}&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210328126&requestMessage=undefined&transaction=cancelOffer`,
      PASSWORD
    );

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Confirm Transaction');

    cy.contains('Offer sequence:').next().should('have.text', this.sequence);
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
