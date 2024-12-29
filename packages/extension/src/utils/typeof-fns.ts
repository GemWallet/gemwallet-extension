type TypeofType = 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'undefined';

type TypeCheckFn = (thing: unknown) => boolean;

/**
 * Curried function for creating typeof checker functions.
 * @param {string} type The type to check against (eg 'string', 'number')
 * @param {function} [secondaryTest] Optional additional test function to run in cases where a type match isn't always a sure indicator.
 * @returns {boolean} Whether the value matches the type
 */
const isTypeof =
  <T>(type: TypeofType, secondaryTest?: TypeCheckFn) =>
  (thing: unknown): thing is T => {
    const matches = typeof thing === type;
    if (matches && secondaryTest) return secondaryTest(thing);
    return matches;
  };

/** Determines if a value is a function type. */
export const isFunction = isTypeof<(...args: unknown[]) => unknown>('function');
/** Determines if a value is a numeric type (int or float). */
export const isNumber = isTypeof<number>('number', (thing) => !isNaN(thing as number));
/** Determins if a value is string type. */
export const isString = isTypeof<string>('string');
/** Determines if a value is the special type `undefined`. */
export const isUndefined = isTypeof<undefined>('undefined');

/** Determines if a value is an object (excluding arrays and functions). */
export const isObject = <T = Record<string, unknown>>(thing: unknown): thing is T => {
  if (thing === null || typeof thing !== 'object') return false;
  return thing.toString() === '[object Object]';
};

/** Determines if a value is boolean type. */
export const isBoolean = isTypeof<boolean>('boolean');

export const isDate = isTypeof<Date>(
  'object',
  (maybeDate) => maybeDate instanceof Date && !isNaN(+maybeDate)
);
