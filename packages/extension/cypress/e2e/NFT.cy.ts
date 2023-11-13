/// <reference types="cypress" />

import { Chain, XRPLNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

// deepcode ignore NoHardcodedPasswords: password used for testing purposes
const PASSWORD = 'SECRET_PASSWORD';
const STORAGE_KEY = '1693425372955.3833';

describe('Mint', () => {
  const MINT_NFT_URL = `http://localhost:3000/mint-nft?storageKey=${STORAGE_KEY}&id=210401976&requestMessage=undefined&transaction=mintNFT`;

  const params = {
    fee: '199',
    transferFee: 3000,
    NFTokenTaxon: 0,
    memos: [
      {
        memo: {
          memoType: '4465736372697074696f6e',
          memoData: '54657374206d656d6f'
        }
      }
    ],
    flags: {
      tfOnlyXRP: false,
      tfTransferable: true
    },
    URI: '4d696e746564207468726f7567682047656d57616c6c657421'
  };

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
          chain: Chain.XRPL,
          name: XRPLNetwork.TESTNET
        })
      );
    });
  });

  it('Mint NFT', () => {
    navigate(MINT_NFT_URL, PASSWORD, STORAGE_KEY, params);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Mint NFT');

    cy.contains('Transfer Fee').next().should('have.text', '3%');
    cy.contains('Taxon').next().should('have.text', '0');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Transferable');
    cy.contains('Network fees').next().should('have.text', '0.000199 XRP (MANUAL)');
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

  it('View a NFT in the NFT Viewer', () => {
    navigate('localhost:3000', PASSWORD);

    // Wait for the wallet to load
    cy.get('[data-testid="token-loader"]').should('not.exist');

    // Go to NFT Viewer
    cy.contains('button', 'NFTs').click();

    // Find a NFT and open the details
    cy.get('[data-testid="nft-card"]').first().click();

    // Check that the details view is open
    cy.contains('NFT Details');
    cy.contains('Token ID');
    cy.contains('Description');
  });

  it('Read the minted NFT Token ID from the transaction history', () => {
    navigate('localhost:3000', PASSWORD);

    // Wait for the wallet to load
    cy.get('[data-testid="token-loader"]').should('not.exist');

    // Go to transaction history
    cy.contains('button', 'History').click();

    // Find a mint transaction
    cy.contains('Mint NFT').closest('.MuiPaper-root').click();

    // Find the NFT Token ID in the transaction details and add it to the URL
    cy.contains('NFT Token ID')
      .next()
      .invoke('text')
      .then((NFTokenID) => {
        cy.wrap(NFTokenID).as('NFTokenID');
      });
  });

  it('Create NFT Offer (50 XRP)', function () {
    const url = `http://localhost:3000/create-nft-offer?storageKey=${STORAGE_KEY}&id=210403222&requestMessage=undefined&transaction=createNFTOffer`;

    const params = {
      amount: '50000000',
      fee: '199',
      flags: {
        tfSellNFToken: true
      },
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ],
      NFTokenID: this.NFTokenID
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create NFT Offer');

    cy.contains('p', 'NFT').next().should('have.text', this.NFTokenID);
    cy.contains('Amount').next().should('have.text', '50 XRP');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Offer type: Sell offer', 'NFTokenMint');

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

  it('Create NFT Offer (0.4 SOLO (non hex)', function () {
    const url = `http://localhost:3000/create-nft-offer?storageKey=${STORAGE_KEY}&id=210403222&requestMessage=undefined&transaction=createNFTOffer`;

    const params = {
      amount: {
        currency: 'SOLO',
        issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
        value: '0.4'
      },
      fee: '199',
      flags: {
        tfSellNFToken: true
      },
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ],
      NFTokenID: this.NFTokenID
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create NFT Offer');

    cy.contains('p', 'NFT').next().should('have.text', this.NFTokenID);
    cy.contains('Amount').next().should('have.text', '0.4 SOLO');
    cy.contains('Trustline').next().should('have.text', 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Offer type: Sell offer');

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

  it('Create NFT Offer (0.4 SOLO (hex)', function () {
    const url = `http://localhost:3000/create-nft-offer?storageKey=${STORAGE_KEY}&id=210403222&requestMessage=undefined&transaction=createNFTOffer`;

    const params = {
      amount: {
        currency: '534F4C4F00000000000000000000000000000000',
        issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
        value: '0.4'
      },
      fee: '199',
      flags: {
        tfSellNFToken: true
      },
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ],
      NFTokenID: this.NFTokenID
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create NFT Offer');

    cy.contains('p', 'NFT').next().should('have.text', this.NFTokenID);
    cy.contains('Amount').next().should('have.text', '0.4 SOLO');
    cy.contains('Trustline').next().should('have.text', 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Flags').next().should('have.text', 'Offer type: Sell offer');

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

  it('Read the Offer ID', () => {
    navigate('localhost:3000', PASSWORD);

    // Wait for the wallet to load
    cy.get('[data-testid="token-loader"]').should('not.exist');

    // Go to transaction history
    cy.contains('button', 'History').click();

    // Find a mint transaction
    cy.contains('Create NFT offer').closest('.MuiPaper-root').click();

    // Find the Offer ID in the transaction details and add it to the URL
    cy.contains('Offer ID')
      .next()
      .invoke('text')
      .then((OfferID) => {
        cy.wrap(OfferID).as('OfferID');
      });
  });

  it('Accept NFT Offer', function () {
    const url = `http://localhost:3000/accept-nft-offer?storageKey=${STORAGE_KEY}&id=210402654&requestMessage=undefined&transaction=acceptNFTOffer`;

    const params = {
      NFTokenSellOffer: this.OfferID,
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

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Accept NFT Offer');

    cy.contains('Sell Offer').next().should('have.text', this.OfferID);

    // Confirm
    cy.contains('button', 'Submit').click();

    cy.get('h1[data-testid="transaction-title"]').should('have.text', 'Transaction in progress');
    cy.get('p[data-testid="transaction-subtitle"]').should(
      'have.text',
      'We are processing your transactionPlease wait'
    );

    // Since we are trying to accept our own offer, we should get an error
    // But this means that the transaction was submitted successfully
    cy.contains('tecCANT_ACCEPT_OWN_NFTOKEN_OFFER', {
      timeout: 10000
    });
  });

  it('Accept NFT Offer (Brokered, SOLO non hex)', function () {
    const url = `http://localhost:3000/accept-nft-offer?storageKey=${STORAGE_KEY}&id=210402654&requestMessage=undefined&transaction=acceptNFTOffer`;

    const params = {
      NFTokenSellOffer: this.OfferID,
      fee: '199',
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ],
      NFTokenBrokerFee: {
        currency: 'SOLO',
        issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
        value: '0.1'
      }
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Accept NFT Offer');

    cy.contains('Sell Offer').next().should('have.text', this.OfferID);

    cy.contains('Broker Fee').next().should('have.text', '0.1 SOLO');
    cy.contains('Trustline').next().should('have.text', 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');

    // Confirm
    cy.contains('button', 'Submit').click();

    // Since we are trying to accept our own offer, we should get an error
    // But this means that the transaction was submitted successfully
    cy.contains('both NFTokenSellOffer and NFTokenBuyOffer must be set if using brokered mode', {
      timeout: 10000
    });
  });

  it('Accept NFT Offer (Brokered, SOLO hex)', function () {
    const url = `http://localhost:3000/accept-nft-offer?storageKey=${STORAGE_KEY}&id=210402654&requestMessage=undefined&transaction=acceptNFTOffer`;

    const params = {
      NFTokenSellOffer: this.OfferID,
      fee: '199',
      memos: [
        {
          memo: {
            memoType: '4465736372697074696f6e',
            memoData: '54657374206d656d6f'
          }
        }
      ],
      NFTokenBrokerFee: {
        currency: '534F4C4F00000000000000000000000000000000',
        issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
        value: '0.1'
      }
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Accept NFT Offer');

    cy.contains('Sell Offer').next().should('have.text', this.OfferID);

    cy.contains('Broker Fee').next().should('have.text', '0.1 SOLO');
    cy.contains('Trustline').next().should('have.text', 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');

    // Confirm
    cy.contains('button', 'Submit').click();

    // Since we are trying to accept our own offer, we should get an error
    // But this means that the transaction was submitted successfully
    cy.contains('both NFTokenSellOffer and NFTokenBuyOffer must be set if using brokered mode', {
      timeout: 10000
    });
  });

  it('Cancel NFT Offer', function () {
    const url = `http://localhost:3000/cancel-nft-offer?storageKey=${STORAGE_KEY}&id=210402654&requestMessage=undefined&transaction=cancelNFTOffer`;

    const params = {
      NFTokenOffers: [this.OfferID],
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

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Cancel NFT Offer');

    cy.contains('p', 'Offer').next().should('have.text', this.OfferID);

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

  it('Burn NFT', function () {
    const url = `http://localhost:3000/burn-nft?storageKey=${STORAGE_KEY}&id=210402654&requestMessage=undefined&transaction=burnNFT`;

    const params = {
      NFTokenID: this.NFTokenID,
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

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Burn NFT');

    cy.contains('p', 'NFT').next().should('have.text', this.NFTokenID);

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
