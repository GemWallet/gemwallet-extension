import { Chain, XahauNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

const PASSWORD = Cypress.env('password');
const LOCAL_STORAGE_WALLETS = Cypress.env('localStorage');
const STORAGE_KEY = '1693425372955.3833';

describe('Xahau transactions', () => {
  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem('wallets', LOCAL_STORAGE_WALLETS);
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

  it('Sign Transaction: SetHook', () => {
    const transaction = {
      TransactionType: 'SetHook',
      Hooks: [
        {
          Hook: {
            CreateCode:
              '0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E02230303656E76057472616365000003656E7606616363657074000103656E76025F670002030201030503010002062B077F0141B088040B7F004180080B7F0041A6080B7F004180080B7F0041B088040B7F0041000B7F0041010B07080104686F6F6B00030AC4800001C0800001017F230041106B220124002001200036020C41920841134180084112410010001A410022002000420010011A41012200200010021A200141106A240042000B0B2C01004180080B254163636570742E633A2043616C6C65642E00224163636570742E633A2043616C6C65642E22',
            Flags: 1,
            HookApiVersion: 0,
            HookGrants: [
              {
                HookGrant: {
                  HookHash: '78CAF69EEE950A6C55A450AC2A980DE434D624CD1B13148E007E28B7B6461CC8'
                }
              }
            ],
            HookNamespace: '3963ADEB1B0E8934C0963680531202FD511FF1E16D5864402C2DA63861C420A8',
            HookOn: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFFE',
            HookParameters: [
              {
                HookParameter: {
                  HookParameterName: 'ABCDEF12',
                  HookParameterValue: '12345678'
                }
              }
            ]
          }
        }
      ]
    };

    navigate(
      'http://localhost:3000/sign-transaction?storageKey=1693425372955.3833&id=210401828&requestMessage=undefined&sign=transaction',
      PASSWORD,
      '1693425372955.3833',
      { transaction }
    );

    // Confirm
    cy.contains('button', 'Sign').click({ timeout: 30000 });

    cy.get('h1[data-testid="transaction-title"]').contains('Transaction accepted', {
      timeout: 10000
    });
    cy.get('p[data-testid="transaction-subtitle"]').should('have.text', 'Transaction Successful');
  });

  it('Submit Transaction: SetHook', () => {
    const transaction = {
      TransactionType: 'SetHook',
      Hooks: [
        {
          Hook: {
            CreateCode:
              '0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E02230303656E76057472616365000003656E7606616363657074000103656E76025F670002030201030503010002062B077F0141B088040B7F004180080B7F0041A6080B7F004180080B7F0041B088040B7F0041000B7F0041010B07080104686F6F6B00030AC4800001C0800001017F230041106B220124002001200036020C41920841134180084112410010001A410022002000420010011A41012200200010021A200141106A240042000B0B2C01004180080B254163636570742E633A2043616C6C65642E00224163636570742E633A2043616C6C65642E22',
            Flags: 1,
            HookApiVersion: 0,
            HookGrants: [
              {
                HookGrant: {
                  HookHash: '78CAF69EEE950A6C55A450AC2A980DE434D624CD1B13148E007E28B7B6461CC8'
                }
              }
            ],
            HookNamespace: '3963ADEB1B0E8934C0963680531202FD511FF1E16D5864402C2DA63861C420A8',
            HookOn: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFFE',
            HookParameters: [
              {
                HookParameter: {
                  HookParameterName: 'ABCDEF12',
                  HookParameterValue: '12345678'
                }
              }
            ]
          }
        }
      ]
    };

    navigate(
      'http://localhost:3000/submit-transaction?storageKey=1693425372955.3833&id=210401828&requestMessage=undefined&submit=transaction',
      PASSWORD,
      '1693425372955.3833',
      { transaction }
    );

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Submit Transaction');

    // Confirm
    cy.contains('button', 'Submit').click({ timeout: 30000 });

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
