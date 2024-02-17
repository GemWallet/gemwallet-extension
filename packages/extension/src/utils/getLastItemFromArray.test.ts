import { getLastItemFromArray } from './getLastItemFromArray';
import { describe, it, expect } from 'vitest';

describe('getLastItemFromArray', () => {
  it('returns the  item of an array', () => {
    const myArray = [1, 2, 3, 4];
    expect(getLastItemFromArray(myArray)).toEqual(4);
  });

  it('returns undefined for an empty array', () => {
    const myArray: number[] = [];
    expect(getLastItemFromArray(myArray)).toBeUndefined();
  });

  it('returns the  item of a string array', () => {
    const myArray = ['hello', 'world'];
    expect(getLastItemFromArray(myArray)).toEqual('world');
  });

  it('returns the last item of a mixed type array', () => {
    const myArray = ['hello', 1, { name: 'John' }];
    expect(getLastItemFromArray(myArray)).toEqual({ name: 'John' });
  });
});
