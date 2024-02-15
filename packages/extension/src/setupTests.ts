// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import 'vitest-canvas-mock';

// Export globally TextEncoder and TextDecoder for hashicon-react
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Make sure that the Jest context as the proper size
global.innerWidth = 357;
global.innerHeight = 600;

// Mock chrome global object
// Source: https://groups.google.com/a/chromium.org/g/chromium-extensions/c/hssoAlvluW8
beforeAll(() => {
  const chromeMock = {
    tabs: {
      query: vi.fn((_queryInfo, callback) => {
        callback([{ id: 123 }]);
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      create: vi.fn((_: { url: string }) => {})
    },
    sidePanel: {
      open: vi.fn()
    },
    commands: {
      getAll: vi.fn(() => {
        return [];
      })
    }
  };

  vi.stubGlobal('chrome', chromeMock);
});
