import { Network, NETWORK } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

// deepcode ignore NoHardcodedPasswords: password used for testing purposes
const PASSWORD = 'SECRET_PASSWORD';
const STORAGE_KEY = '1693425372955.3833';

describe('Offers', () => {
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

  it('Create offer (XRP to ETH)', () => {
    const url = `http://localhost:3000?create-offer&storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerGets: '10000000',
      takerPays: {
        currency: 'ETH',
        issuer: 'rnm76Qgz4G9G4gZBJVuXVvkbt7gVD7szey',
        value: '0.1'
      },
      flags: {
        tfPassive: true
      },
      fee: '199',
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ]
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create Offer');

    cy.contains('Taker Gets').next().should('have.text', '10 XRP');
    cy.contains('Taker Pays').next().should('have.text', '0.1 ETH');
    cy.contains('Trustline').next().should('have.text', 'rnm76Qgz4G9G4gZBJVuXVvkbt7gVD7szey');
    cy.contains('Network fees').next().should('have.text', '0.000199 XRP (MANUAL)');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Passive');

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

  it('Create offer (XRP to SOLO (non hex))', () => {
    const url = `http://localhost:3000?create-offer&storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerGets: '10000000',
      takerPays: {
        currency: 'SOLO',
        issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
        value: '0.1'
      },
      flags: {
        tfPassive: true
      },
      fee: '199',
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ]
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create Offer');

    cy.contains('Taker Gets').next().should('have.text', '10 XRP');
    cy.contains('Taker Pays').next().should('have.text', '0.1 SOLO');
    cy.contains('Trustline').next().should('have.text', 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');
    cy.contains('Network fees').next().should('have.text', '0.000199 XRP (MANUAL)');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Passive');

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

  it('Create offer (SOLO (non hex) to XRP)', () => {
    const url = `http://localhost:3000?create-offer&storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerPays: '10000000',
      takerGets: {
        currency: 'SOLO',
        issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
        value: '0.1'
      },
      flags: {
        tfPassive: true
      },
      fee: '199',
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ]
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create Offer');

    cy.contains('Taker Pays').next().should('have.text', '10 XRP');
    cy.contains('Taker Gets').next().should('have.text', '0.1 SOLO');
    cy.contains('Trustline').next().should('have.text', 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');
    cy.contains('Network fees').next().should('have.text', '0.000199 XRP (MANUAL)');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Passive');

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

  it('Create offer (XRP to SOLO (hex))', () => {
    const url = `http://localhost:3000?create-offer&storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerGets: '10000000',
      takerPays: {
        currency: 'SOLO',
        issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
        value: '0.1'
      },
      flags: {
        tfPassive: true
      },
      fee: '199',
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ]
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create Offer');

    cy.contains('Taker Gets').next().should('have.text', '10 XRP');
    cy.contains('Taker Pays').next().should('have.text', '0.1 SOLO');
    cy.contains('Trustline').next().should('have.text', 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');
    cy.contains('Network fees').next().should('have.text', '0.000199 XRP (MANUAL)');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Passive');

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

  it('Create offer (SOLO (hex) to XRP)', () => {
    const url = `http://localhost:3000?create-offer&storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerPays: '10000000',
      takerGets: {
        currency: 'SOLO',
        issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
        value: '0.1'
      },
      flags: {
        tfPassive: true
      },
      fee: '199',
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ]
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create Offer');

    cy.contains('Taker Pays').next().should('have.text', '10 XRP');
    cy.contains('Taker Gets').next().should('have.text', '0.1 SOLO');
    cy.contains('Trustline').next().should('have.text', 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');
    cy.contains('Network fees').next().should('have.text', '0.000199 XRP (MANUAL)');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Passive');

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

  it('Read the Sequence ID from the transaction history', () => {
    navigate('localhost:3000', PASSWORD);

    // Wait for the wallet to load
    cy.get('[data-testid="token-loader"]').should('not.exist');

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
      `http://localhost:3000?offerSequence=${this.sequence}&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210328126&requestMessage=undefined&transaction=cancelOffer`,
      PASSWORD
    );

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Cancel Offer');

    cy.contains('Offer Sequence').next().should('have.text', this.sequence);
    cy.contains('Memo').next().should('have.text', 'Test memo');

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
