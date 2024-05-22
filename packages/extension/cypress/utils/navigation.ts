const mockSessionStorage = {};

export const navigate = (url: string, password: string, storageKey?: string, data?) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      win['chrome'] = win['chrome'] || {};
      win['chrome'].runtime = {
        sendMessage() {}
      };

      win['chrome'].storage = {
        local: {
          get() {},
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
            cb({ [key]: mockSessionStorage[key] });
          },
          remove(key, cb) {
            delete mockSessionStorage[key];
            if (cb) cb();
          }
        }
      };

      if (storageKey && data) {
        win['chrome'].storage.session.set({
          [storageKey]: JSON.stringify(data)
        });
      }

      win['chrome'].runtime.lastError = null;

      cy.stub(win['chrome'].runtime, 'sendMessage').resolves({});
    }
  });

  // Login
  cy.get('input[name="password"]').type(password);
  cy.contains('button', 'Unlock').click();
};
