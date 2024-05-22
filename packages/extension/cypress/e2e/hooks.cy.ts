import { Chain, XahauNetwork } from '@gemwallet/constants';

import { navigate } from '../utils/navigation';

const PASSWORD = Cypress.env('PASSWORD');
const LOCAL_STORAGE_WALLETS = Cypress.env('LOCAL_STORAGE_WALLETS');
const STORAGE_KEY = '1693425372955.3833';

describe('Hooks', () => {
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

  it('Set Hook through API', () => {
    const url = `http://localhost:3000/set-hook?storageKey=${STORAGE_KEY}&id=210401976&requestMessage=undefined&transaction=setHook`;

    const params = {
      hooks: [
        {
          Hook: {
            CreateCode:
              '0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E02230303656E76057472616365000003656E7606616363657074000103656E76025F670002030201030503010002062B077F0141B088040B7F004180080B7F0041A6080B7F004180080B7F0041B088040B7F0041000B7F0041010B07080104686F6F6B00030AC4800001C0800001017F230041106B220124002001200036020C41920841134180084112410010001A410022002000420010011A41012200200010021A200141106A240042000B0B2C01004180080B254163636570742E633A2043616C6C65642E00224163636570742E633A2043616C6C65642E22',
            Flags: 1,
            HookApiVersion: 0,
            HookOn: 'F'.repeat(58) + 'BFFFFE',
            HookNamespace: '3963ADEB1B0E8934C0963680531202FD511FF1E16D5864402C2DA63861C420A8',
            HookParameters: [
              {
                HookParameter: {
                  HookParameterName: 'ABCDEF12',
                  HookParameterValue: '12345678'
                }
              }
            ],
            HookGrants: [
              {
                HookGrant: {
                  HookHash: '78CAF69EEE950A6C55A450AC2A980DE434D624CD1B13148E007E28B7B6461CC8'
                }
              }
            ]
          }
        }
      ]
    };

    navigate(url, PASSWORD, STORAGE_KEY, params);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Set Hook');

    cy.get('[data-cy=expandButton]').each(($btn) => {
      cy.wrap($btn).click();
    });

    cy.contains(
      '"CreateCode":"0061736D01000000011C0460057F7F7F7F7F017E60037F7F7E017E60027F7F017F60017F017E02230303656E76057472616365000003656E7606616363657074000103656E76025F670002030201030503010002062B077F0141B088040B7F004180080B7F0041A6080B7F004180080B7F0041B088040B7F0041000B7F0041010B07080104686F6F6B00030AC4800001C0800001017F230041106B220124002001200036020C41920841134180084112410010001A410022002000420010011A41012200200010021A200141106A240042000B0B2C01004180080B254163636570742E633A2043616C6C65642E00224163636570742E633A2043616C6C65642E22"'
    );
    cy.contains('"Flags":1');
    cy.contains('"HookOn":"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFFE"');
    cy.contains(
      '"HookNamespace":"3963ADEB1B0E8934C0963680531202FD511FF1E16D5864402C2DA63861C420A8"'
    );
    cy.contains('"HookHash":"78CAF69EEE950A6C55A450AC2A980DE434D624CD1B13148E007E28B7B6461CC8"');
    cy.contains('"HookParameterName":"ABCDEF12"');
    cy.contains('"HookParameterValue":"12345678"');

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
