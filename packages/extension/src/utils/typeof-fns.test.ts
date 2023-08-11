import {
  isBoolean,
  isDate,
  isFunction,
  isNumber,
  isObject,
  isString,
  isUndefined
} from './typeof-fns';

describe('isFunction', () => {
  it('correctly identifies functions', () => {
    // non-functions
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction('')).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction(false)).toBe(false);
    expect(isFunction(200)).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction({})).toBe(false);
    // functions
    expect(
      isFunction(() => {
        // this is intentional, removes typescript-eslint/no-empty-function error
      })
    ).toBe(true);
    expect(isFunction(Array.from)).toBe(true);
    expect(isFunction(isNumber)).toBe(true);
  });
});

describe('isNumber', () => {
  it('correctly identifies numbers', () => {
    // non-numbers
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber('')).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber(false)).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(
      isNumber(() => {
        // this is intentional, removes typescript-eslint/no-empty-function error
      })
    ).toBe(false);
    expect(isNumber(Array.from)).toBe(false);
    // numbers
    expect(isNumber(200)).toBe(true);
    expect(isNumber(0.5)).toBe(true);
    // should return `false` for `NaN`
    expect(isNumber(+'hello')).toBe(false);
  });
});

describe('isString', () => {
  it('correctly identifies strings', () => {
    // non-strings
    expect(isString(undefined)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString(false)).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString({})).toBe(false);
    expect(
      isString(() => {
        // this is intentional, removes typescript-eslint/no-empty-function error
      })
    ).toBe(false);
    expect(isString(Array.from)).toBe(false);
    expect(isString(200)).toBe(false);
    // strings
    expect(isString('')).toBe(true);
    expect(isString('test')).toBe(true);
  });
});

describe('isUndefined', () => {
  it('correctly identifies "undefined"', () => {
    // defined
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined(true)).toBe(false);
    expect(isUndefined(false)).toBe(false);
    expect(isUndefined([])).toBe(false);
    expect(isUndefined({})).toBe(false);
    expect(
      isUndefined(() => {
        return;
      })
    ).toBe(false);
    expect(isUndefined(Array.from)).toBe(false);
    expect(isUndefined(200)).toBe(false);
    expect(isUndefined('')).toBe(false);
    // undefined
    expect(isUndefined(undefined)).toBe(true);
  });
});

describe('isObject', () => {
  it('correctly identifies objects', () => {
    // things we do not want to consider objects
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(
      isObject(() => {
        // this is intentional, removes typescript-eslint/no-empty-function error
      })
    ).toBe(false);
    expect(isObject(Array.from)).toBe(false);
    expect(isObject(200)).toBe(false);
    expect(isObject('')).toBe(false);
    // object
    expect(isObject({})).toBe(true);
  });
});

describe('isBoolean', () => {
  it('correctly identifies a boolean', () => {
    // Things which are not a boolean
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean('1')).toBe(false);
    expect(isBoolean('')).toBe(false);
    expect(isBoolean([])).toBe(false);
    expect(isBoolean({})).toBe(false);
    expect(isBoolean(Array.from)).toBe(false);

    // Boolean
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });
});

describe('isDate', () => {
  it('correctly identifies a date', () => {
    // Things which are not a date
    expect(isDate(undefined)).toBe(false);
    expect(isDate(1)).toBe(false);
    expect(isDate('1')).toBe(false);
    expect(isDate('not a date')).toBe(false);
    expect(isDate('')).toBe(false);
    expect(isDate([])).toBe(false);
    expect(isDate({})).toBe(false);
    expect(isDate(Array.from)).toBe(false);

    // Date
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date('1/1/2001'))).toBe(true);
  });
});
