import { STORAGE_REMEMBER_SESSION } from '../constants';
import { loadRememberSessionState, saveRememberSessionState } from './login';

// Mock the localStorage object and its methods
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn()
};

beforeEach(() => {
  jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => localStorageMock);
});

afterEach(() => {
  // Reset the mock after each test
  localStorageMock.getItem.mockReset();
  localStorageMock.setItem.mockReset();
});

describe('saveRememberSessionState', () => {
  test('should save the remember session state to local storage', () => {
    const state = true;
    saveRememberSessionState(state);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_REMEMBER_SESSION,
      JSON.stringify(state)
    );
  });

  test('should throw an error if saving to local storage fails', () => {
    const error = new Error('Error saving to local storage');
    localStorage.setItem = jest.fn(() => {
      throw error;
    });
    expect(() => saveRememberSessionState(true)).toThrowError(error);
  });
});

describe('loadRememberSessionState', () => {
  test('should load the remember session state from local storage', () => {
    const state = true;
    localStorage.getItem = jest.fn(() => JSON.stringify(state));
    expect(loadRememberSessionState()).toEqual(state);
  });

  test('should return false if no state is found in local storage', () => {
    localStorage.getItem = jest.fn(() => null);
    expect(loadRememberSessionState()).toEqual(false);
  });

  test('should return false if an error occurs while loading the state', () => {
    const error = new Error('Error loading state from local storage');
    localStorageMock.getItem = jest.fn(() => {
      throw error;
    });
    expect(loadRememberSessionState()).toEqual(false);
  });
});
