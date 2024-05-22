/// <reference types="cypress" />

import { Chain, XRPLNetwork } from '@gemwallet/constants';
import { navigate } from '../utils/navigation';

const PASSWORD = Cypress.env('PASSWORD');
const LOCAL_STORAGE_WALLETS = Cypress.env('LOCAL_STORAGE_WALLETS');
const DEFAULT_WALLET_ADDRESS = Cypress.env('DEFAULT_WALLET_ADDRESS');
const VALID_ADDRESS = 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o';

describe('Delete account', () => {
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

  it('should delete account', () => {
    navigate('http://localhost:3000', PASSWORD);

    // Click on settings
    cy.contains('Settings').click();

    // Click on delete account
    cy.contains('Delete Account').click();

    // Enter wrong password
    cy.get('input[name="password"]').type('wrong_password');
    cy.get('input[name="password"]').type('{enter}');
    cy.get('#password-helper-text').should('have.text', 'Incorrect password');

    // Enter correct password
    cy.get('input[name="password"]').clear();
    cy.get('input[name="password"]').type(PASSWORD);
    cy.get('input[name="password"]').type('{enter}');

    // Should be on the delete account page
    cy.contains('You are about to permanently delete your account from the XRPL').should('exist');
    cy.contains('button', 'Continue').click();

    // Should be on the delete account form page
    cy.contains('Enter the destination XRPL address to receive your remaining XRP funds').should(
      'exist'
    );
    cy.contains('button', 'Continue').should('be.disabled');

    // Enter invalid address
    cy.get('input[name="destination-address"]').type('invalid_address');
    cy.get('input[name="destination-address"]').blur();
    cy.get('#destination-address-helper-text').should(
      'have.text',
      'Your destination address is invalid'
    );
    cy.contains('button', 'Continue').should('be.disabled');

    // Enter the same address as the current wallet
    cy.get('input[name="destination-address"]').clear();
    cy.get('input[name="destination-address"]').type(DEFAULT_WALLET_ADDRESS);
    cy.get('input[name="destination-address"]').blur();
    cy.get('#destination-address-helper-text').should(
      'have.text',
      'You cannot use the current address as the destination address'
    );
    cy.contains('button', 'Continue').should('be.disabled');

    // Enter valid address
    cy.get('input[name="destination-address"]').clear();
    cy.get('input[name="destination-address"]').type(VALID_ADDRESS);
    cy.contains('button', 'Continue').should('not.be.disabled');
    cy.contains('button', 'Continue').click();

    // Should be on the delete account confirmation page
    cy.contains('Final Step: Confirm Account Deletion').should('exist');

    cy.contains('You are about to permanently delete the following account from the XRPL:')
      .next()
      .should('have.text', DEFAULT_WALLET_ADDRESS);

    cy.contains('and transfer your XRP funds to:').next().should('have.text', VALID_ADDRESS);

    // We are not going to actually delete the account, so we just click on the cancel button
    cy.contains('button', 'Cancel').click();

    // Should be on the settings page
    cy.contains('Settings').should('exist');
  });
});
