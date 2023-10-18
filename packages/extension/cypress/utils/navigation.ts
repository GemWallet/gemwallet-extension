const mockSessionStorage = {};

export const navigate = (url: string, password: string, storageKey?: string, data?) => {
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
        },
        session: {
          set(obj, cb) {
            Object.assign(mockSessionStorage, obj);
            if (cb) cb();
          },
          get(key, cb) {
            cb(mockSessionStorage[key]);
          },
          remove(key, cb) {
            delete mockSessionStorage[key];
            if (cb) cb();
          }
        }
      };

      if (storageKey && data) {
        (win as any).chrome.storage.session.set({
          [storageKey]: { [storageKey]: JSON.stringify(data) }
        });
      }

      (win as any).chrome.runtime.lastError = null;

      cy.stub((win as any).chrome.runtime, 'sendMessage').resolves({});
    }
  });

  // Login
  cy.get('input[name="password"]').type(password);
  cy.contains('button', 'Unlock').click();
};
