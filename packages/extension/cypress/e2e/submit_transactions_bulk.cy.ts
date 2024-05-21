import { Chain, XRPLNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

describe('Submit Transactions (Bulk)', () => {
  const PASSWORD = Cypress.env('password');
  const LOCAL_STORAGE_WALLETS = Cypress.env('localStorageWallets');
  const ISSUER_SOLO_ADDRESS = Cypress.env('issuerSOLOAddress');
  const ISSUER_ETH_ADDRESS = Cypress.env('issuerETHAddress');

  const transactions = [
    {
      ID: '001',
      TransactionType: 'Payment',
      Destination: ISSUER_SOLO_ADDRESS,
      Amount: '100000',
      Memos: [
        {
          Memo: {
            MemoData: '54657374206D656D6F',
            MemoType: '4465736372697074696F6E'
          }
        }
      ]
    },
    {
      ID: '002',
      TransactionType: 'TrustSet',
      LimitAmount: {
        currency: 'ETH',
        issuer: ISSUER_ETH_ADDRESS,
        value: '10000000'
      },
      Memos: [
        {
          Memo: {
            MemoType: '4465736372697074696f6e',
            MemoData: '54657374206d656d6f'
          }
        }
      ],
      Fee: '199'
    },
    {
      ID: '003',
      TransactionType: 'Payment',
      Destination: ISSUER_SOLO_ADDRESS,
      Amount: '1000',
      Memos: [
        {
          Memo: {
            MemoData: '54657374206D656D6F',
            MemoType: '4465736372697074696F6E'
          }
        }
      ]
    },
    {
      ID: '004',
      TransactionType: 'Payment',
      Destination: ISSUER_SOLO_ADDRESS,
      Amount: '1000',
      Memos: [
        {
          Memo: {
            MemoData: '54657374206D656D6F',
            MemoType: '4465736372697074696F6E'
          }
        }
      ]
    }
  ];

  const transactionsMap = transactions.reduce((acc, transaction, index) => {
    acc[index] = transaction;
    return acc;
  }, {});

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

  it('Submit Transactions', () => {
    const url = `http://localhost:3000/submit-transactions-bulk?storageKey=1693425372955.3833&id=93425114&requestMessage=undefined&submit=txBulk`;

    navigate(url, PASSWORD, '1693425372955.3833', {
      transactions: transactionsMap,
      waitForHashes: false
    });

    cy.contains('button', 'Enable Permission').click();

    // Check recap view data
    cy.contains('Total number of transactions').next().should('have.text', '4');

    cy.contains('Types of transactions').next().should('have.text', 'Payment: 3\nTrustSet: 1');

    cy.contains('Total network fees')
      .next()
      .should('have.text', '0.000235 XRP', { timeout: 10000 });

    // Begin
    cy.contains('button', 'Begin').click();

    // Submit transactions
    cy.contains('button', 'Submit All').click();
    cy.contains('You are about to submit 4 transactions at once.').should('be.visible');
    cy.contains('button', 'OK').click();

    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transactions in progress');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'We are processing your transactionsPlease wait'
    );

    cy.get('h1[data-testid="transaction-title"]').contains('Transactions accepted', {
      timeout: 30000
    });
    cy.get('p[data-testid="transaction-subtitle"]').should('have.text', 'Transactions Successful');
  });
});
