import { STORAGE_REMEMBER_SESSION } from '../constants';
import { loadRememberSessionState, saveRememberSessionState } from './login';
import { saveInChromeLocalStorage, loadFromChromeLocalStorage } from './storageChromeLocal';

jest.mock('./storageChromeLocal', () => ({
  saveInChromeLocalStorage: jest.fn(),
  loadFromChromeLocalStorage: jest.fn()
}));

describe('saveRememberSessionState', () => {
  beforeEach(() => {
    saveInChromeLocalStorage.mockClear();
  });

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
  beforeEach(() => {
    loadFromChromeLocalStorage.mockClear();
  });

  test('should load the remember session state from chrome storage', async () => {
    const state = true;
    (loadFromChromeLocalStorage as jest.Mock).mockResolvedValue(JSON.stringify(state));

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(state);
  });

  test('should return false if no state is found in chrome storage', async () => {
    (loadFromChromeLocalStorage as jest.Mock).mockResolvedValue({});

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(false);
  });

  test('should return false if an error occurs while loading the state', async () => {
    (loadFromChromeLocalStorage as jest.Mock).mockRejectedValue(
      new Error('Error loading state from chrome storage')
    );

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(false);
  });
});
