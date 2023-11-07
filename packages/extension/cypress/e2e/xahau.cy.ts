import { Chain, XahauNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

// deepcode ignore NoHardcodedPasswords: password used for testing purposes
const PASSWORD = 'SECRET_PASSWORD';
const STORAGE_KEY = '1693425372955.3833';

describe('Xahau transactions', () => {
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
          chain: Chain.XAHAU,
          name: XahauNetwork.XAHAU_TESTNET
        })
      );
    });
  });

  it('Mint NFT', () => {
    const MINT_NFT_URL = `http://localhost:3000/mint-nft?storageKey=${STORAGE_KEY}&id=210401976&requestMessage=undefined&transaction=mintNFT`;

    const params = {
      URI: '4d696e746564207468726f7567682047656d57616c6c657421'
    };

    navigate(MINT_NFT_URL, PASSWORD, STORAGE_KEY, params);

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

  it('Read the minted NFT Token ID from the NFT viewer', () => {
    navigate('localhost:3000', PASSWORD);

    // Wait for the wallet to load
    cy.get('[data-testid="token-loader"]').should('not.exist');

    // Go to transaction history
    cy.contains('button', 'NFTs').click();

    // Find the NFT using the decoded URI
    cy.contains('Minted through GemWallet!').closest('.MuiPaper-root').click();

    // Find the NFT Token ID in the transaction details and add it to the URL
    cy.contains('Token ID')
      .next()
      .invoke('text')
      .then((NFTokenID) => {
        cy.wrap(NFTokenID).as('NFTokenID');
      });
  });

  it('Burn NFT', function () {
    const url = `http://localhost:3000/burn-nft?storageKey=${STORAGE_KEY}&id=210402654&requestMessage=undefined&transaction=burnNFT`;

    const params = {
      NFTokenID: this.NFTokenID
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
