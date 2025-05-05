import { SetHookRequest } from '@gemwallet/constants';

import { WalletLedger } from '../../../types';
import { buildSetHook } from './buildXahauTransaction';
import { describe, it, expect } from 'vitest';
import { Wallet } from 'xrpl';

const wallet: WalletLedger = {
  name: 'name',
  publicAddress: 'publicAddress',
  wallet: {} as Wallet
};

describe('buildSetHook', () => {
  it('should build SetHook transaction correctly with hooks', () => {
    const params: SetHookRequest = {
      hooks: [
        {
          Hook: {
            CreateCode: 'code',
            HookApiVersion: 0,
            HookNamespace: 'namespace',
            HookOn: 'hookOn',
            HookParameters: [],
            Flags: 0
          }
        }
      ]
    };

    const result = buildSetHook(params, wallet);

    expect(result.TransactionType).toEqual('SetHook');
    expect(result.Account).toEqual(wallet.publicAddress);
    expect(result.Hooks).toEqual(params.hooks);
  });
});
