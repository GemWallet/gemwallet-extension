/// <reference types="cypress" />

import { Network, NETWORK } from '@gemwallet/constants';

describe('Switch networks', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';

  let networkLocalStorage = undefined;
  let customNetworkLocalStorage = undefined;
  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem(
        'wallets',
        'U2FsdGVkX18AlCMtFj8wFHFphXwjUK7eE88VPubDBdA0p2PPWShzgCETsCScUwibFZBToMQ4k3pAJj1bwvo0IRlIr0eGnGizk3/Ga309btSK5igom3OSYbqT5SA3JHjCCdTgsM/+tSauA6kdb/A6O3GpNXdXihKa4V/SiuwxOUV9iTP/5zrgvGyGPkv6onJb'
      );
      if (networkLocalStorage) {
        win.localStorage.setItem('network', networkLocalStorage);
      }
      if (customNetworkLocalStorage) {
        win.localStorage.setItem('customNetworks', customNetworkLocalStorage);
      }
    });
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        (win as any).chrome = (win as any).chrome || {};
        (win as any).chrome.runtime = {
          sendMessage(message, cb) {}
        };

        cy.stub((win as any).chrome.runtime, 'sendMessage').resolves({});
      }
    });

    cy.get('.MuiCircularProgress-root', { timeout: 20000 }).should('not.exist');

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();
  });

  it('Switch from Mainnet (default network) to Testnet', () => {
    // Mainnet should be the default network
    cy.get('div[data-testid="network-indicator"]').should(
      'have.text',
      NETWORK[Network.MAINNET].name
    );

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Select the testnet network
    cy.contains('button', NETWORK[Network.TESTNET].name).click();

    // Make sure that the network is switched to Testnet
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should(
      'have.text',
      NETWORK[Network.TESTNET].name
    );

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
    });
  });

  it('Switch from Testnet (localStorage) to Devnet', () => {
    // Testnet should be the network from localStorage
    cy.get('div[data-testid="network-indicator"]').should(
      'have.text',
      NETWORK[Network.TESTNET].name,
      { timeout: 1500 }
    );

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Select the Devnet network
    cy.contains('button', NETWORK[Network.DEVNET].name).click();

    // Make sure that the network is switched to Devnet
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should(
      'have.text',
      NETWORK[Network.DEVNET].name,
      { timeout: 1500 }
    );

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
    });
  });

  it('Switch from Devnet (localStorage) to AMMDevnet', () => {
    // Devnet should be the network from localStorage
    cy.get('div[data-testid="network-indicator"]').should(
      'have.text',
      NETWORK[Network.DEVNET].name,
      { timeout: 1500 }
    );

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Select the AMMDevnet network
    cy.contains('button', NETWORK[Network.AMM_DEVNET].name).click();

    // Make sure that the network is switched to AMMDevnet
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should(
      'have.text',
      NETWORK[Network.AMM_DEVNET].name,
      {
        timeout: 1500
      }
    );

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
    });
  });

  it('Add a custom network', () => {
    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Open the add custom network window
    cy.contains('button', 'Add a custom network').click();

    // Expect an error if the network name already exists
    cy.get('input[name="network-name"]').type(NETWORK[Network.MAINNET].name);
    cy.get('#network-name-helper-text').should(
      'have.text',
      'A network with this name already exists'
    );

    // Expect an error if the network name is empty
    cy.get('input[name="network-name"]').clear().type(' ');
    cy.get('#network-name-helper-text').should('have.text', 'The network name cannot be empty');

    // Expect an error if the server is invalid
    cy.get('input[name="server"]').clear().type('https://testnet.xrpl-labs.com');
    cy.get('#server-helper-text').should(
      'have.text',
      'The server must be a valid WebSocket URL (start with wss://)'
    );

    // Fill the form
    cy.get('input[name="network-name"]').clear().type('XRPL Labs Testnet');
    cy.get('input[name="server"]').clear().type('wss://testnet.xrpl-labs.com');

    // Save the new network
    cy.contains('button', 'Add network').click();

    // Switch to the new network
    cy.contains('button', 'XRPL Labs Testnet').click();

    // Make sure that the network is switched to the custom network
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'XRPL Labs Testnet', {
      timeout: 1500
    });

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
      customNetworkLocalStorage = win.localStorage.getItem('customNetworks');
    });
  });

  it('Delete the custom network', () => {
    // Custom network should be the network from localStorage
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'XRPL Labs Testnet', {
      timeout: 1500
    });

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Click the DeleteIcon of the custom network
    cy.get('[data-testid="DeleteIcon"]').click();

    // Expect an error dialog when trying to delete the network we are currently connected to
    cy.contains('button', 'OK', { timeout: 3000 }).should('be.visible').click();

    // Connect back to the AMMDevnet network
    cy.contains('button', NETWORK[Network.AMM_DEVNET].name).click();

    // Make sure that the network is switched to AMMDevnet
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should(
      'have.text',
      NETWORK[Network.AMM_DEVNET].name,
      {
        timeout: 1500
      }
    );

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Click the DeleteIcon of the custom network
    cy.get('[data-testid="DeleteIcon"]').click();

    // Click "Confirm" on the delete network dialog
    cy.contains('button', 'Delete').click();

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
      customNetworkLocalStorage = win.localStorage.getItem('customNetworks');
    });
  });

  it('Switch from AMMDevnet (localStorage) to Mainnet', () => {
    // AMMDevnet should be the network from localStorage
    cy.get('div[data-testid="network-indicator"]').should(
      'have.text',
      NETWORK[Network.AMM_DEVNET].name,
      {
        timeout: 1500
      }
    );

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Select the Mainnet network
    cy.contains('button', NETWORK[Network.MAINNET].name).click();

    // Make sure that the network is switched to Mainnet
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should(
      'have.text',
      NETWORK[Network.MAINNET].name,
      {
        timeout: 1500
      }
    );

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
    });
  });
});
