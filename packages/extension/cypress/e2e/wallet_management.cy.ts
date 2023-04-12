/// <reference types="cypress" />

describe('Setup the initial wallet (no previous wallet)', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';
  const SEED = 'sEdSPaf6j72fpTWbufHtN8yBTtm4QSK';
  const MNEMONIC =
    'frozen voyage arrest venture question deny print brother genuine hip tooth rigid life output bitter raccoon kidney wine urban rookie allow envelope pitch marriage';
  const ERROR_MNEMONIC = 'You need 6 digits';

  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('Create a new wallet', () => {
    // Go to the create new wallet page
    cy.contains('button', 'Create a new wallet').click();

    // Get the seed
    cy.get('p').then(($seedParagraph) => {
      const seed = $seedParagraph.text();
      cy.contains('button', 'Next').click();

      // Confirm the seed
      cy.contains('button', 'Confirm').click();
      // Error if the seed is incorrect
      cy.get('p#seed-helper-text').should('have.text', 'Seed incorrect');

      // Make sure that after the copy of the seed, we can create a password
      cy.get('input[name="seed"]').type(seed);
      cy.contains('button', 'Confirm').click();

      // Error if the password is less than 8 characters
      cy.contains('button', 'Next').click();
      cy.get('p#confirm-password-helper-text').should(
        'have.text',
        'Password must be at least 8 characters long'
      );

      // Error if the passwords are not equal
      cy.get('input[name="password"]').type('12345678');
      cy.get('input[name="confirm-password"]').type(PASSWORD);
      cy.contains('button', 'Next').click();
      cy.get('p#confirm-password-helper-text').should('have.text', 'Passwords must match');

      // Set up the proper password
      cy.get('input[name="password"]').clear().type(PASSWORD);
      cy.get('input[name="confirm-password"]').clear().type(PASSWORD);
      cy.contains('button', 'Next').click();
      cy.contains("Woo, you're in!").should('be.visible');
      cy.contains(
        'Follow along with product updates or reach out if you have any questions.'
      ).should('be.visible');

      // Redirection to the login page
      cy.contains('button', 'Finish').click();
      cy.contains('GemWallet').should('be.visible');
      cy.contains('Internet cryptocurrency payments made easy').should('be.visible');
    });
  });

  it('Import a wallet - Family Seed', () => {
    // Go to the import a new wallet page
    cy.contains('button', 'Import a wallet').click();

    // Select import by family seed
    cy.contains('button', 'Family Seed').click();
    cy.contains('button', 'Next').click();

    // Error if the seed is incorrect
    cy.contains('button', 'Next').click();
    cy.get('p#seed-helper-text').should('have.text', 'Your seed is invalid');

    // Add the seed to the import
    cy.get('input[name="seed"]').type(SEED);
    cy.contains('button', 'Next').click();

    // Error if the password is less than 8 characters
    cy.contains('button', 'Next').click();
    cy.get('p#confirm-password-helper-text').should(
      'have.text',
      'Password must be at least 8 characters long'
    );

    // Error if the passwords are not equal
    cy.get('input[name="password"]').type('12345678');
    cy.get('input[name="confirm-password"]').type(PASSWORD);
    cy.contains('button', 'Next').click();
    cy.get('p#confirm-password-helper-text').should('have.text', 'Passwords must match');

    // Set up the proper password
    cy.get('input[name="password"]').clear().type(PASSWORD);
    cy.get('input[name="confirm-password"]').clear().type(PASSWORD);
    cy.contains('button', 'Next').click();
    cy.contains("Woo, you're in!").should('be.visible');
    cy.contains('Follow along with product updates or reach out if you have any questions.').should(
      'be.visible'
    );

    // Redirection to the login page
    cy.contains('button', 'Finish').click();
    cy.contains('GemWallet').should('be.visible');
    cy.contains('Internet cryptocurrency payments made easy').should('be.visible');
  });

  it('Import a wallet - Mnemonic', () => {
    // Go to the import a new wallet page
    cy.contains('button', 'Import a wallet').click();

    // Select import by mnemonic
    cy.contains('button', 'Mnemonic').click();
    cy.contains('button', 'Next').click();

    // Error if the mnemonic is incorrect
    cy.contains('button', 'Next').click();
    cy.get('p#mnemonic-helper-text').should('have.text', 'Your mnemonic is invalid');

    // Add the mnemonic to the import
    cy.get('input[name="mnemonic"]').type(MNEMONIC);
    cy.contains('button', 'Next').click();

    // Error if the password is less than 8 characters
    cy.contains('button', 'Next').click();
    cy.get('p#confirm-password-helper-text').should(
      'have.text',
      'Password must be at least 8 characters long'
    );

    // Error if the passwords are not equal
    cy.get('input[name="password"]').type('12345678');
    cy.get('input[name="confirm-password"]').type(PASSWORD);
    cy.contains('button', 'Next').click();
    cy.get('p#confirm-password-helper-text').should('have.text', 'Passwords must match');

    // Set up the proper password
    cy.get('input[name="password"]').clear().type(PASSWORD);
    cy.get('input[name="confirm-password"]').clear().type(PASSWORD);
    cy.contains('button', 'Next').click();
    cy.contains("Woo, you're in!").should('be.visible');
    cy.contains('Follow along with product updates or reach out if you have any questions.').should(
      'be.visible'
    );

    // Redirection to the login page
    cy.contains('button', 'Finish').click();
    cy.contains('GemWallet').should('be.visible');
    cy.contains('Internet cryptocurrency payments made easy').should('be.visible');
  });

  it('Import a wallet - Secret numbers', () => {
    // Go to the import a new wallet page
    cy.contains('button', 'Import a wallet').click();

    // Select import by secret numbers
    cy.contains('button', 'Secret numbers').click();
    cy.contains('button', 'Next').click();

    // Errors if the mnemonic is incorrect
    cy.contains('button', 'Next').click();
    cy.get('p#numbersA-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersB-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersC-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersD-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersE-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersF-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersG-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersH-helper-text').should('have.text', ERROR_MNEMONIC);

    // Add the mnemonic to the import
    cy.get('input[name="numbersA"]').type('521853');
    cy.get('input[name="numbersB"]').type('547766');
    cy.get('input[name="numbersC"]').type('315810');
    cy.get('input[name="numbersD"]').type('178405');
    cy.get('input[name="numbersE"]').type('277620');
    cy.get('input[name="numbersF"]').type('280851');
    cy.get('input[name="numbersG"]').type('504208');
    cy.get('input[name="numbersH"]').type('176716');
    cy.contains('button', 'Next').click();

    // Error if the password is less than 8 characters
    cy.contains('button', 'Next').click();
    cy.get('p#confirm-password-helper-text').should(
      'have.text',
      'Password must be at least 8 characters long'
    );

    // Error if the passwords are not equal
    cy.get('input[name="password"]').type('12345678');
    cy.get('input[name="confirm-password"]').type(PASSWORD);
    cy.contains('button', 'Next').click();
    cy.get('p#confirm-password-helper-text').should('have.text', 'Passwords must match');

    // Set up the proper password
    cy.get('input[name="password"]').clear().type(PASSWORD);
    cy.get('input[name="confirm-password"]').clear().type(PASSWORD);
    cy.contains('button', 'Next').click();
    cy.contains("Woo, you're in!").should('be.visible');
    cy.contains('Follow along with product updates or reach out if you have any questions.').should(
      'be.visible'
    );

    // Redirection to the login page
    cy.contains('button', 'Finish').click();
    cy.contains('GemWallet').should('be.visible');
    cy.contains('Internet cryptocurrency payments made easy').should('be.visible');
  });
});

describe('Add an additional wallet (with previous wallet)', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';
  const SEED = 'sEdSPaf6j72fpTWbufHtN8yBTtm4QSK';
  const MNEMONIC =
    'frozen voyage arrest venture question deny print brother genuine hip tooth rigid life output bitter raccoon kidney wine urban rookie allow envelope pitch marriage';
  const ERROR_MNEMONIC = 'You need 6 digits';
  let walletLocalStorage =
    'U2FsdGVkX18AlCMtFj8wFHFphXwjUK7eE88VPubDBdA0p2PPWShzgCETsCScUwibFZBToMQ4k3pAJj1bwvo0IRlIr0eGnGizk3/Ga309btSK5igom3OSYbqT5SA3JHjCCdTgsM/+tSauA6kdb/A6O3GpNXdXihKa4V/SiuwxOUV9iTP/5zrgvGyGPkv6onJb';

  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem('wallets', walletLocalStorage);
    });
    cy.visit('http://localhost:3000/');

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();

    // Go to the add wallet screen
    cy.get('[aria-label="Wallet icon with green border"]').click();
    cy.get('button[aria-label="Add wallet"]').click();

    //Type password
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Confirm Password').click();
  });

  it('Add a new wallet - Create a new wallet', () => {
    // Go to the create new wallet page
    cy.contains('button', 'Create a new wallet').click();

    // Get the seed
    cy.get('p').then(($seedParagraph) => {
      const seed = $seedParagraph.text();
      cy.contains('button', 'Next').click();

      // Confirm the seed
      cy.contains('button', 'Confirm').click();
      // Error if the seed is incorrect
      cy.get('p#seed-helper-text').should('have.text', 'Seed incorrect');

      // Make sure that after the copy of the seed, we can create a password
      cy.get('input[name="seed"]').type(seed);
      cy.contains('button', 'Confirm').click();

      // Redirection to the wallets page
      cy.contains('Your wallets').should('be.visible');
      cy.get('div[data-testid="wallet-container"]').children().should('have.length', 2);
      cy.get('div[data-testid="wallet-container"]').first().contains('rJD2...9uVr');

      // Save the current state of the localStorage
      cy.window().then((win) => {
        walletLocalStorage = win.localStorage.getItem('wallets');
      });
    });
  });

  it('Add a new wallet - Family Seed', () => {
    // Go to the import a new wallet page
    cy.contains('button', 'Import a new wallet').click();

    // Select import by family seed
    cy.contains('button', 'Family Seed').click();
    cy.contains('button', 'Next').click();

    // Error if the seed is incorrect
    cy.contains('button', 'Add Seed').click();
    cy.get('p#seed-helper-text').should('have.text', 'Your seed is invalid');

    // Add the seed to the import
    cy.get('input[name="seed"]').type(SEED);
    cy.contains('button', 'Add Seed').click();

    // Redirection to the wallets page
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 3);
    cy.get('div[data-testid="wallet-container"]').first().contains('rJD2...9uVr');

    // Save the current state of the localStorage
    cy.window().then((win) => {
      walletLocalStorage = win.localStorage.getItem('wallets');
    });
  });

  it('Add a new wallet - Mnemonic', () => {
    // Go to the import a new wallet page
    cy.contains('button', 'Import a new wallet').click();

    // Select import by mnemonic
    cy.contains('button', 'Mnemonic').click();
    cy.contains('button', 'Next').click();

    // Error if the mnemonic is incorrect
    cy.contains('button', 'Next').click();
    cy.get('p#mnemonic-helper-text').should('have.text', 'Your mnemonic is invalid');

    // Add the mnemonic to the import
    cy.get('input[name="mnemonic"]').type(MNEMONIC);
    cy.contains('button', 'Next').click();

    // Redirection to the wallets page
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 4);
    cy.get('div[data-testid="wallet-container"]').first().contains('rJD2...9uVr');

    // Save the current state of the localStorage
    cy.window().then((win) => {
      walletLocalStorage = win.localStorage.getItem('wallets');
    });
  });

  it('Add a new wallet - Secret numbers', () => {
    // Go to the import a new wallet page
    cy.contains('button', 'Import a new wallet').click();

    // Select import by secret numbers
    cy.contains('button', 'Secret numbers').click();
    cy.contains('button', 'Next').click();

    // Errors if the mnemonic is incorrect
    cy.contains('button', 'Next').click();
    cy.get('p#numbersA-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersB-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersC-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersD-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersE-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersF-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersG-helper-text').should('have.text', ERROR_MNEMONIC);
    cy.get('p#numbersH-helper-text').should('have.text', ERROR_MNEMONIC);

    // Add the mnemonic to the import
    cy.get('input[name="numbersA"]').type('521853');
    cy.get('input[name="numbersB"]').type('547766');
    cy.get('input[name="numbersC"]').type('315810');
    cy.get('input[name="numbersD"]').type('178405');
    cy.get('input[name="numbersE"]').type('277620');
    cy.get('input[name="numbersF"]').type('280851');
    cy.get('input[name="numbersG"]').type('504208');
    cy.get('input[name="numbersH"]').type('176716');
    cy.contains('button', 'Next').click();

    // Redirection to the wallets page
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 5);
    cy.get('div[data-testid="wallet-container"]').first().contains('rJD2...9uVr');
  });
});

describe('Edit wallet', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';
  const MNEMONIC =
    'frozen voyage arrest venture question deny print brother genuine hip tooth rigid life output bitter raccoon kidney wine urban rookie allow envelope pitch marriage';

  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem(
        'wallets',
        'U2FsdGVkX18lhnWbAn5EJDspfPXAVOsREMhg5+2NHl2IH8nrDClBsmNH75PutpB4AO0ddYhMYmNk8fsfx2ym2HW3VJGn8x+ZQreGATWF7beHhhx2vPJDsnODdOXWdcF2eqmeEp7P3pQZfZnGggvXiwqvn/NPg4mbzx5GjPcx1TfuFjBLM/YbyxXskVeOKs+fL4fGvCBj4s1/8x0Ok9fRYFdN2i9ODEJDNuJRrAZygsiqVaFPEBHHg7FfZYLuECwIOA2MukcjESPOAPRg2JMLbjWblI6rcLVx4zblkjMsfWOYujuq7zDWWt6hNCncs6DnHpBr4joQIayx6bNqpXUBQ0sEA1gpSeAvKuDf7eWpHzEJtpCUYEXYa8zW25XeABiUU8Hht7dK0r6L2V7mWpPNbQTTFA7yaXrhTQI2JNCt31ZEIWCWd2w5vgTGvPTJcs8xKPmUtXk+fJDbG9zHzwSrMDMLh5TtxzCGmTFUGNAc2NCZJKNjj6SUJGW2AgLqt3NYPpG91Ec6V0baina40VAZ/5pgCgzUWgkcxFU8J1htMaD2cMnAs6MeqVCeJOPpOVjIVD70RsJRsR8782K2pJezwV5TdzEYKkfpzEYMEl6aKfJSGzbGcActM1LDpi8fJBuqUia3YhqhAMevSFWpuw9anA=='
      );
    });
    cy.visit('http://localhost:3000/');

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();

    // Go to the list wallet screen
    cy.get('[aria-label="Wallet icon with green border"]').click();
  });

  it('Remove a wallet from the list', () => {
    // Open the edit on second wallet
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 3);
    cy.get('button[aria-label="More"]').eq(1).click();

    // Remove the wallet
    cy.contains('button', 'Remove Wallet').click();
    cy.contains('button', 'Remove').click();

    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 2);
    cy.contains('Wallet 2').should('be.visible');
    cy.contains('Wallet 3').should('not.exist');
    cy.contains('Mnemonic').should('be.visible');
  });

  it('Change wallet name', () => {
    // Open the edit on second wallet
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 3);
    cy.get('button[aria-label="More"]').eq(1).click();

    // Rename the wallet
    cy.get('ul').children().first().click();
    cy.get('input[name="walletName"]').clear().type('Saving account');
    cy.contains('button', 'Save').click();

    // Go back to the list of wallets
    cy.get('button[aria-label="close"]').click();

    // Verify that the name is changed
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 3);
    cy.contains('Wallet 2').should('be.visible');
    cy.contains('Saving account').should('be.visible');
    cy.contains('Mnemonic').should('be.visible');

    // Lock the extension
    cy.get('button[aria-label="close"]').click();
    cy.contains('button', 'Wallets').parent().children().eq(2).click();
    cy.contains('button', 'Lock').click();

    // Check if the wallets are properly loaded with the name changed
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();
    cy.get('[aria-label="Wallet icon with green border"]').click();
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 3);
    cy.contains('Wallet 2').should('be.visible');
    cy.contains('Saving account').should('be.visible');
    cy.contains('Mnemonic').should('be.visible');
  });

  it('Show Seed', () => {
    // Open the edit on second wallet
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 3);
    cy.get('button[aria-label="More"]').eq(1).click();

    // Make sure that cancel button works properly
    cy.get('ul').children().eq(1).click();
    cy.contains('button', 'Cancel').click();

    // Make sure that the password error is displayed
    cy.get('ul').children().eq(1).click();
    cy.contains(
      'Do not share your seed! If someone has your seed they will have full control of your wallet.'
    ).should('be.visible');
    cy.contains('Please confirm your password before we show you your seed').should('be.visible');
    cy.contains('button', 'Show').click();
    cy.contains('Incorrect password').should('be.visible');

    // Show seed
    cy.get('input[name="password"]').clear().type(PASSWORD);
    cy.contains('button', 'Show').click();
    cy.contains('sEdSPaf6j72fpTWbufHtN8yBTtm4QSK').should('be.visible');
  });

  it('Show Mnemonic', () => {
    // Open the edit on last wallet
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 3);
    cy.get('button[aria-label="More"]').last().click();

    // Make sure that cancel button works properly
    cy.get('ul').children().eq(1).click();
    cy.contains('button', 'Cancel').click();

    // Make sure that the password error is displayed
    cy.get('ul').children().eq(1).click();
    cy.contains(
      'Do not share your mnemonic! If someone has your mnemonic they will have full control of your wallet.'
    ).should('be.visible');
    cy.contains('Please confirm your password before we show you your mnemonic').should(
      'be.visible'
    );
    cy.contains('button', 'Show').click();
    cy.contains('Incorrect password').should('be.visible');

    // Show mnemonic
    cy.get('input[name="password"]').clear().type(PASSWORD);
    cy.contains('button', 'Show').click();
    cy.contains(MNEMONIC).should('be.visible');
  });
});

describe('Switch wallet', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';
  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem(
        'wallets',
        'U2FsdGVkX18lhnWbAn5EJDspfPXAVOsREMhg5+2NHl2IH8nrDClBsmNH75PutpB4AO0ddYhMYmNk8fsfx2ym2HW3VJGn8x+ZQreGATWF7beHhhx2vPJDsnODdOXWdcF2eqmeEp7P3pQZfZnGggvXiwqvn/NPg4mbzx5GjPcx1TfuFjBLM/YbyxXskVeOKs+fL4fGvCBj4s1/8x0Ok9fRYFdN2i9ODEJDNuJRrAZygsiqVaFPEBHHg7FfZYLuECwIOA2MukcjESPOAPRg2JMLbjWblI6rcLVx4zblkjMsfWOYujuq7zDWWt6hNCncs6DnHpBr4joQIayx6bNqpXUBQ0sEA1gpSeAvKuDf7eWpHzEJtpCUYEXYa8zW25XeABiUU8Hht7dK0r6L2V7mWpPNbQTTFA7yaXrhTQI2JNCt31ZEIWCWd2w5vgTGvPTJcs8xKPmUtXk+fJDbG9zHzwSrMDMLh5TtxzCGmTFUGNAc2NCZJKNjj6SUJGW2AgLqt3NYPpG91Ec6V0baina40VAZ/5pgCgzUWgkcxFU8J1htMaD2cMnAs6MeqVCeJOPpOVjIVD70RsJRsR8782K2pJezwV5TdzEYKkfpzEYMEl6aKfJSGzbGcActM1LDpi8fJBuqUia3YhqhAMevSFWpuw9anA=='
      );
    });
    cy.visit('http://localhost:3000/');

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();
  });

  it('Switch wallet', () => {
    // Check the current wallet
    cy.contains('Wallet 2').should('be.visible');
    cy.contains('Wallet 3').should('not.exist');

    // Go to the list wallet screen
    cy.get('[aria-label="Wallet icon with green border"]').click();

    // Select the second wallet
    cy.contains('Your wallets').should('be.visible');
    cy.get('div[data-testid="wallet-container"]').children().should('have.length', 3);
    cy.get('div[data-testid="wallet-container"]').children().eq(1).click();

    // Check the freshly selected wallet
    cy.contains('Wallet 2').should('not.exist');
    cy.contains('Wallet 3').should('be.visible');

    // Lock the extension
    cy.contains('button', 'Wallets').parent().children().eq(2).click();
    cy.contains('button', 'Lock').click();

    // Check if the default wallet is properly loaded
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();
    cy.contains('Wallet 2').should('not.exist');
    cy.contains('Wallet 3').should('be.visible');
  });
});

describe('Reset password', () => {
  beforeEach(() => {
    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem(
        'wallets',
        'U2FsdGVkX18lhnWbAn5EJDspfPXAVOsREMhg5+2NHl2IH8nrDClBsmNH75PutpB4AO0ddYhMYmNk8fsfx2ym2HW3VJGn8x+ZQreGATWF7beHhhx2vPJDsnODdOXWdcF2eqmeEp7P3pQZfZnGggvXiwqvn/NPg4mbzx5GjPcx1TfuFjBLM/YbyxXskVeOKs+fL4fGvCBj4s1/8x0Ok9fRYFdN2i9ODEJDNuJRrAZygsiqVaFPEBHHg7FfZYLuECwIOA2MukcjESPOAPRg2JMLbjWblI6rcLVx4zblkjMsfWOYujuq7zDWWt6hNCncs6DnHpBr4joQIayx6bNqpXUBQ0sEA1gpSeAvKuDf7eWpHzEJtpCUYEXYa8zW25XeABiUU8Hht7dK0r6L2V7mWpPNbQTTFA7yaXrhTQI2JNCt31ZEIWCWd2w5vgTGvPTJcs8xKPmUtXk+fJDbG9zHzwSrMDMLh5TtxzCGmTFUGNAc2NCZJKNjj6SUJGW2AgLqt3NYPpG91Ec6V0baina40VAZ/5pgCgzUWgkcxFU8J1htMaD2cMnAs6MeqVCeJOPpOVjIVD70RsJRsR8782K2pJezwV5TdzEYKkfpzEYMEl6aKfJSGzbGcActM1LDpi8fJBuqUia3YhqhAMevSFWpuw9anA=='
      );
    });
    cy.visit('http://localhost:3000/');
  });

  it('Reset password', () => {
    // Go on the reset password page
    cy.contains('Reset Password').click();
    cy.contains('Resetting your password will remove your secret seeds').should('be.visible');
    cy.contains(
      'This will remove all existing wallets and replace them with new ones. Make sure you have your existing private secret seeds backed up.'
    ).should('be.visible');

    // Cancel should return to login page
    cy.contains('button', 'Cancel').click();
    cy.contains('GemWallet').should('be.visible');
    cy.contains('Internet cryptocurrency payments made easy').should('be.visible');

    // Reset the password
    cy.contains('Reset Password').click();
    cy.contains('button', 'Continue').click();

    // Onboarding screen of GemWallet
    cy.contains('Internet cryptocurrency payments made easy').should('be.visible');
    cy.contains('button', 'Create a new wallet').should('be.visible');
    cy.contains('button', 'Import a wallet').should('be.visible');
  });
});
