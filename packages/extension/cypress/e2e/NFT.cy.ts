/// <reference types="cypress" />

import { Network, NETWORK } from '@gemwallet/constants';

describe('Mint', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';
  const MINT_NFT_URL = `http://localhost:3000?URI=4d696e746564207468726f7567682047656d57616c6c657421&flags=%7B%22tfOnlyXRP%22%3Afalse%2C%22tfTransferable%22%3Atrue%7D&fee=199&transferFee=3000&NFTokenTaxon=0&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210324818&requestMessage=undefined&transaction=mintNFT`;

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

  it('Mint NFT', () => {
    navigate(MINT_NFT_URL, PASSWORD);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Mint NFT');

    cy.contains('Transfer Fee').next().should('have.text', '3%');
    cy.contains('NFTokenTaxon').next().should('have.text', '0');
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
    const url = `http://localhost:3000?amount=50000000&NFTokenID=${this.NFTokenID}&fee=199&flags=%7B%22tfSellNFToken%22%3Atrue%7D&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210325582&requestMessage=undefined&transaction=createNFTOffer`;
    navigate(url, PASSWORD);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create NFT Offer');

    cy.contains('NFT Token ID').next().should('have.text', this.NFTokenID);
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
    const amount = JSON.stringify({
      currency: 'SOLO',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
      value: '0.4'
    });

    const url = `http://localhost:3000?NFTokenID=${this.NFTokenID}&amount=${amount}&fee=199&flags=%7B%22tfSellNFToken%22%3Atrue%7D&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210340212&requestMessage=undefined&transaction=createNFTOffer`;
    navigate(url, PASSWORD);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create NFT Offer');

    cy.contains('NFT Token ID').next().should('have.text', this.NFTokenID);
    cy.contains('Amount')
      .next()
      .should('have.text', '0.4 SOLO\nIssuer: rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');
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
    const amount = JSON.stringify({
      currency: '534F4C4F00000000000000000000000000000000',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
      value: '0.4'
    });

    const url = `http://localhost:3000?NFTokenID=${this.NFTokenID}&amount=${amount}&fee=199&flags=%7B%22tfSellNFToken%22%3Atrue%7D&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210340212&requestMessage=undefined&transaction=createNFTOffer`;
    navigate(url, PASSWORD);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Create NFT Offer');

    cy.contains('NFT Token ID').next().should('have.text', this.NFTokenID);
    cy.contains('Amount')
      .next()
      .should('have.text', '0.4 SOLO\nIssuer: rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');
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
    const url = `http://localhost:3000?NFTokenSellOffer=${this.OfferID}&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210325959&requestMessage=undefined&transaction=acceptNFTOffer`;

    navigate(url, PASSWORD);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Accept NFT Offer');

    cy.contains('NFT Token Sell Offer').next().should('have.text', this.OfferID);

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
    const amount = JSON.stringify({
      currency: 'SOLO',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
      value: '0.1'
    });
    const url = `http://localhost:3000?NFTokenBrokerFee=${amount}&NFTokenSellOffer=${this.OfferID}&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210325959&requestMessage=undefined&transaction=acceptNFTOffer`;

    navigate(url, PASSWORD);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Accept NFT Offer');

    cy.contains('NFT Token Sell Offer').next().should('have.text', this.OfferID);

    cy.contains('NFT Token Broker Fee')
      .next()
      .should('have.text', '0.1 SOLO\nIssuer: rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');

    // Confirm
    cy.contains('button', 'Submit').click();

    // Since we are trying to accept our own offer, we should get an error
    // But this means that the transaction was submitted successfully
    cy.contains('both NFTokenSellOffer and NFTokenBuyOffer must be set if using brokered mode', {
      timeout: 10000
    });
  });

  it('Accept NFT Offer (Brokered, SOLO hex)', function () {
    const amount = JSON.stringify({
      currency: '534F4C4F00000000000000000000000000000000',
      issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
      value: '0.1'
    });
    const url = `http://localhost:3000?NFTokenBrokerFee=${amount}&NFTokenSellOffer=${this.OfferID}&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210325959&requestMessage=undefined&transaction=acceptNFTOffer`;

    navigate(url, PASSWORD);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Accept NFT Offer');

    cy.contains('NFT Token Sell Offer').next().should('have.text', this.OfferID);

    cy.contains('NFT Token Broker Fee')
      .next()
      .should('have.text', '0.1 SOLO\nIssuer: rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN');

    // Confirm
    cy.contains('button', 'Submit').click();

    // Since we are trying to accept our own offer, we should get an error
    // But this means that the transaction was submitted successfully
    cy.contains('both NFTokenSellOffer and NFTokenBuyOffer must be set if using brokered mode', {
      timeout: 10000
    });
  });

  it('Cancel NFT Offer', function () {
    const url = `http://localhost:3000?NFTokenOffers=%5B%22${this.OfferID}%22%5D&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210325959&requestMessage=undefined&transaction=cancelNFTOffer`;
    navigate(url, PASSWORD);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Cancel NFT Offer');

    cy.contains('Offer ID').next().should('have.text', this.OfferID);

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
    const url = `http://localhost:3000?NFTokenID=${this.NFTokenID}&fee=199&memos=%5B%7B%22memo%22%3A%7B%22memoType%22%3A%224465736372697074696f6e%22%2C%22memoData%22%3A%2254657374206d656d6f%22%7D%7D%5D&id=210325959&requestMessage=undefined&transaction=burnNFT`;
    navigate(url, PASSWORD);

    // Confirm
    cy.get('h1[data-testid="page-title"]').should('have.text', 'Burn NFT');

    cy.contains('NFT Token ID').next().should('have.text', this.NFTokenID);

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
});
