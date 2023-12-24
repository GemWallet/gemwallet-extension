import { SetHookRequest } from '@gemwallet/constants';

import { WalletLedger } from '../../../types';
import { buildSetHook } from './buildXahauTransaction';

const wallet: WalletLedger = {
  name: 'name',
  publicAddress: 'publicAddress',
  wallet: {} as any
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
