import { numbersToSeed } from './numbersToSeed';

describe('numbersToSeed', () => {
  test('should return the seed', () => {
    expect(
      numbersToSeed([
        '518567',
        '524023',
        '229722',
        '454042',
        '312660',
        '026022',
        '001170',
        '073666'
      ])
    ).toEqual('snWyvheVXAqUsvKQTrdmYP8tFE3TY');
  });
});
