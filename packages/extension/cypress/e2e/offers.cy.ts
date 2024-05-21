import { Chain, XRPLNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

const PASSWORD = Cypress.env('password');
const LOCAL_STORAGE_WALLETS = Cypress.env('localStorageWallets');
const ISSUER_ETH_ADDRESS = Cypress.env('issuerETHAddress');
const ISSUER_SOLO_ADDRESS = Cypress.env('issuerSOLOAddress');
const STORAGE_KEY = '1693425372955.3833';

describe('Offers', () => {
  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem('wallets', LOCAL_STORAGE_WALLETS);
      win.localStorage.setItem(
        'network',
        JSON.stringify({
          chain: Chain.XRPL,
          name: XRPLNetwork.TESTNET
        })
      );
    });
  });

  it('Create offer (XRP to ETH)', () => {
    const url = `http://localhost:3000/create-offer?storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerGets: '10000000',
      takerPays: {
        currency: 'ETH',
        issuer: ISSUER_ETH_ADDRESS,
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
    cy.contains('Trustline').next().should('have.text', ISSUER_ETH_ADDRESS);
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
    const url = `http://localhost:3000/create-offer?storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerGets: '10000000',
      takerPays: {
        currency: 'SOLO',
        issuer: ISSUER_SOLO_ADDRESS,
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
    cy.contains('Trustline').next().should('have.text', ISSUER_SOLO_ADDRESS);
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
    const url = `http://localhost:3000/create-offer?storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerPays: '10000000',
      takerGets: {
        currency: 'SOLO',
        issuer: ISSUER_SOLO_ADDRESS,
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
    cy.contains('Trustline').next().should('have.text', ISSUER_SOLO_ADDRESS);
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
    const url = `http://localhost:3000/create-offer?storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerGets: '10000000',
      takerPays: {
        currency: 'SOLO',
        issuer: ISSUER_SOLO_ADDRESS,
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
    cy.contains('Trustline').next().should('have.text', ISSUER_SOLO_ADDRESS);
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
    const url = `http://localhost:3000/create-offer?storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=createOffer`;

    const params = {
      takerPays: '10000000',
      takerGets: {
        currency: 'SOLO',
        issuer: ISSUER_SOLO_ADDRESS,
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
    cy.contains('Trustline').next().should('have.text', ISSUER_SOLO_ADDRESS);
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
      // deepcode ignore PromiseNotCaughtGeneral: No need to have a catch here as this is a test
      .then((sequence) => {
        cy.wrap(sequence).as('sequence');
      });
  });

  it('Cancel offer', function () {
    const url = `http://localhost:3000/cancel-offer?storageKey=${STORAGE_KEY}&id=210404997&requestMessage=undefined&transaction=cancelOffer`;

    const params = {
      offerSequence: this.sequence,
      fee: '199',
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ],
      flags: {
        tfPassive: true
      }
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

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
