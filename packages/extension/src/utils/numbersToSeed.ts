import { Account } from '@xrplf/secret-numbers';

export const numbersToSeed = (numbers: string[]) => {
  const account = new Account(numbers);
  return account.getFamilySeed();
};
