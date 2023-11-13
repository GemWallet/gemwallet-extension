import { Chain, XRPLNetwork } from '@gemwallet/constants';

describe('ReceivePayment View', () => {
  beforeEach(() => {
    // deepcode ignore NoHardcodedPasswords: password used for testing purposes
    const PASSWORD = 'SECRET_PASSWORD';

    // Mock the localStorage with a wallet already loaded
    cy.window().then((win) => {
      win.localStorage.setItem(
        'wallets',
        'U2FsdGVkX1/JAHkPXi6ZonxQukDVxSlHcveDl30pBLB/Y9tPmrtAIi0ulBoj+mgxv/qj29Odgw8pRm0QzwGpT5zKmTRyf4QHmjpl5UcSNfRw95l/ZxPMgOpy/qrOJgWQHKNVK1TUpQHuV/c+ULBmpyOeMsI60paKXKvBEddTfHggacZV9ABvmCZZbIMM4h3tRn0HtVQY8kFvp9yJuUxq8T6BMgHzCys7hzUjtwdZ81YVEfdUShzEkleuqLsx4STqNvibUmf6HnwCgMCCPTzjulr3XvZK+yfreBb3RPsivSCsl5dwSz0ORtNwg04zjLiTvR+1btv91kifEBrMo3dh/Q=='
      );
      win.localStorage.setItem(
        'network',
        JSON.stringify({
          chain: Chain.XRPL,
          name: XRPLNetwork.TESTNET
        })
      );
    });
    cy.visit('http://localhost:3000/', {
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

    cy.get('.MuiCircularProgress-root', { timeout: 20000 }).should('not.exist');

    // Login
    cy.get('input[name="password"]').type(PASSWORD);
    cy.contains('button', 'Unlock').click();

    // Go to the receive page
    cy.contains('button', 'Receive').click();
  });

  it('should display the QRCode and wallet address', () => {
    cy.get('canvas').should('be.visible');

    cy.get('[data-testid="receive-payment-address"]').should('have.text', 'rB3J...7HQu');
  });
});
