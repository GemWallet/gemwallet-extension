import { Network, NETWORK } from '@gemwallet/constants';

describe('Sign Transaction', () => {
  // deepcode ignore NoHardcodedPasswords: password used for testing purposes
  const PASSWORD = 'SECRET_PASSWORD';

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

  it('Sign Transaction', () => {
    const url = `http://localhost:3000?transaction=%7B%22TransactionType%22%3A%22Payment%22%2C%22Destination%22%3A%22rhikRdkFw28csKw9z7fVoBjWncz1HSoQij%22%2C%22Amount%22%3A%22100000%22%7D&id=210329246&requestMessage=undefined&sign=transaction`;
    navigate(url, PASSWORD);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Sign Transaction');

    cy.contains(
      '{"TransactionType":"Payment""Destination":"rhikRdkFw28csKw9z7fVoBjWncz1HSoQij""Amount":"100000""Account":"rB3JmRd5m292YjCsCr65tc8dwZz2WN7HQu"}'
    );

    // Confirm
    cy.contains('button', 'Sign').click();

    cy.get('h1[data-testid="transaction-title"]').contains('Transaction accepted', {
      timeout: 10000
    });
    cy.get('p[data-testid="transaction-subtitle"]').should('have.text', 'Transaction Successful');
  });

  it('Sign Transaction (Set Trustline SOLO 1000000)', () => {
    const transaction = JSON.stringify({
      TransactionType: 'TrustSet',
      LimitAmount: {
        currency: '534F4C4F00000000000000000000000000000000',
        issuer: 'rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN',
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
    });
    const url = `http://localhost:3000?transaction=${transaction}&requestMessage=undefined&sign=transaction`;
    navigate(url, PASSWORD);

    cy.get('h1[data-testid="page-title"]').should('have.text', 'Sign Transaction');

    cy.contains(
      '{"TransactionType":"TrustSet""LimitAmount":{"currency":"534F4C4F00000000000000000000000000000000""issuer":"rHZwvHEs56GCmHupwjA4RY7oPA3EoAJWuN""value":"10000000"}"Memos":[0:{"Memo":{"MemoType":"4465736372697074696f6e""MemoData":"54657374206d656d6f"}}]"Fee":"199""Account":"rB3JmRd5m292YjCsCr65tc8dwZz2WN7HQu"}'
    );

    cy.contains('Transaction Type').next().should('have.text', 'TrustSet');
    cy.contains('Account').next().should('have.text', 'rB3JmRd5m292YjCsCr65tc8dwZz2WN7HQu');
    cy.contains('Limit Amount').next().should('have.text', '10,000,000 SOLO');
    cy.contains('Memo').next().should('have.text', 'Test memo');
    cy.contains('Network fees').next().should('have.text', '0.000199 XRP (MANUAL)');

    // Confirm
    cy.contains('button', 'Sign').click();

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
