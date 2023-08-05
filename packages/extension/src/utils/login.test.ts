import { STORAGE_REMEMBER_SESSION } from '../constants';
import { loadRememberSessionState, saveRememberSessionState } from './login';

// Mock the chrome storage object and its methods
const chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  }
};

// Make sure the chrome object is available globally
global.chrome = chrome as any;

describe('saveRememberSessionState', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    chrome.storage.local.set.mockClear();
  });

  test('should save the remember session state to chrome storage', async () => {
    const state = true;
    saveRememberSessionState(state);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      [STORAGE_REMEMBER_SESSION]: JSON.stringify(state)
    });
  });
});

describe('loadRememberSessionState', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    chrome.storage.local.get.mockClear();
  });

  test('should load the remember session state from chrome storage', async () => {
    const state = true;
    chrome.storage.local.get.mockResolvedValue({
      [STORAGE_REMEMBER_SESSION]: JSON.stringify(state)
    });

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(state);
  });

  test('should return false if no state is found in chrome storage', async () => {
    chrome.storage.local.get.mockResolvedValue({});

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(false);
  });

  test('should return false if an error occurs while loading the state', async () => {
    chrome.storage.local.get.mockRejectedValue(
      new Error('Error loading state from chrome storage')
    );

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(false);
  });
});
