import { STORAGE_REMEMBER_SESSION } from '../constants';
import { loadRememberSessionState, saveRememberSessionState } from './login';
import { saveInChromeStorage, loadFromChromeStorage } from './storageChrome';

jest.mock('./storageChrome', () => ({
  saveInChromeStorage: jest.fn(),
  loadFromChromeStorage: jest.fn()
}));

describe('saveRememberSessionState', () => {
  beforeEach(() => {
    saveInChromeStorage.mockClear();
  });

  test('should save the remember session state to chrome storage', async () => {
    const state = true;
    saveRememberSessionState(state);
    expect(saveInChromeStorage).toHaveBeenCalledWith(
      STORAGE_REMEMBER_SESSION,
      JSON.stringify(state)
    );
  });
});

describe('loadRememberSessionState', () => {
  beforeEach(() => {
    loadFromChromeStorage.mockClear();
  });

  test('should load the remember session state from chrome storage', async () => {
    const state = true;
    (loadFromChromeStorage as jest.Mock).mockResolvedValue({
      [STORAGE_REMEMBER_SESSION]: JSON.stringify(state)
    });

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(state);
  });

  test('should return false if no state is found in chrome storage', async () => {
    (loadFromChromeStorage as jest.Mock).mockResolvedValue({});

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(false);
  });

  test('should return false if an error occurs while loading the state', async () => {
    (loadFromChromeStorage as jest.Mock).mockRejectedValue(
      new Error('Error loading state from chrome storage')
    );

    const loadedState = await loadRememberSessionState();
    expect(loadedState).toEqual(false);
  });
});
