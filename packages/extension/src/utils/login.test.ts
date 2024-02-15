import { STORAGE_REMEMBER_SESSION } from '../constants';
import { loadRememberSessionState, saveRememberSessionState } from './login';
import { saveInChromeLocalStorage, loadFromChromeLocalStorage } from './storageChromeLocal';
import { describe, expect, test, vi, Mock } from 'vitest';

vi.mock('./storageChromeLocal', () => ({
  saveInChromeLocalStorage: vi.fn(),
  loadFromChromeLocalStorage: vi.fn()
}));

describe('saveRememberSessionState', () => {
  test('should save the remember session state to chrome storage', async () => {
    const state = true;
    saveRememberSessionState(state);
    expect(saveInChromeLocalStorage).toHaveBeenCalledWith(
      STORAGE_REMEMBER_SESSION,
      JSON.stringify(state)
    );
  });
});

describe('loadRememberSessionState', () => {
  test('should load the remember session state from chrome storage', async () => {
    const state = true;
    (loadFromChromeLocalStorage as Mock).mockResolvedValue(JSON.stringify(state));

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(state);
  });

  test('should return false if no state is found in chrome storage', async () => {
    (loadFromChromeLocalStorage as Mock).mockResolvedValue({});

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(false);
  });

  test('should return false if an error occurs while loading the state', async () => {
    (loadFromChromeLocalStorage as Mock).mockRejectedValue(
      new Error('Error loading state from chrome storage')
    );

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(false);
  });
});
