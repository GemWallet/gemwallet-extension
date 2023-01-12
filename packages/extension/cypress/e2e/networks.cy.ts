/// <reference types="cypress" />

// deepcode ignore NoHardcodedPasswords: password used for testing purposes
const PASSWORD = 'SECRET_PASSWORD';

describe('Switch networks', () => {
  let networkLocalStorage = undefined;
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
    });
    cy.visit('http://localhost:3000/');

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();
  });

  it('Switch from Mainnet (default network) to Testnet', () => {
    // Mainnet should be the default network
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'Mainnet');

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Select the testnet network
    cy.contains('button', 'Testnet').click();

    // Make sure that the network is switched to Testnet
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'Testnet');

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
    });
  });

  it('Switch from Testnet (localStorage) to Devnet', () => {
    // Testnet should be the network from localStorage
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'Testnet');

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Select the Devnet network
    cy.contains('button', 'Devnet').click();

    // Make sure that the network is switched to Devnet
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'Devnet');

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
    });
  });

  it('Switch from Devnet (localStorage) to NFTDevnet', () => {
    // Devnet should be the network from localStorage
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'Devnet');

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Select the NFTDevnet network
    cy.contains('button', 'NFTDevnet').click();

    // Make sure that the network is switched to NFTDevnet
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'NFTDevnet');

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
    });
  });

  it('Switch from NFTDevnet (localStorage) to Mainnet', () => {
    // NFTDevnet should be the network from localStorage
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'NFTDevnet');

    // Open the change network window
    cy.get('div[data-testid="network-indicator"]').click();
    cy.get('div[data-testid="network-indicator-dialog"]', { timeout: 1500 })
      .find('header')
      .should('have.text', 'Change Network');

    // Select the Mainnet network
    cy.contains('button', 'Mainnet').click();

    // Make sure that the network is switched to Mainnet
    cy.get('div[data-testid="loading"]').should('be.visible');
    cy.get('div[data-testid="network-indicator"]').should('have.text', 'Mainnet');

    // Save the current state of the localStorage
    cy.window().then((win) => {
      networkLocalStorage = win.localStorage.getItem('network');
    });
  });
});
