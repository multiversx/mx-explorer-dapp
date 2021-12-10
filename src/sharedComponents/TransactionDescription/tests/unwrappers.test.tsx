import unwrapper from '../unwrapper';
import { TxActionsEnum } from 'helpers/types';

// file.only
describe('Pager helper tests', () => {
  test('Compound rewards', () => {
    const { action } = {
      action: {
        category: 'mex',
        name: TxActionsEnum.compoundRewards,
        description: 'Reinvest rewards 20 LKFARM',
        arguments: {
          token: {
            type: 'MetaESDT',
            name: 'LockedLPStaked',
            collection: 'LKFARM-9d1ea8',
            identifier: 'LKFARM-9d1ea8-01ee91',
            ticker: 'LKFARM',
            decimals: 18,
            value: '20000000000000000000',
          },
        },
      },
    };
    expect(unwrapper(action)).toEqual(['Reinvest rewards', action.arguments.token]);
  });
  test('Enter farm', () => {
    const { action } = {
      action: {
        category: 'mex',
        name: TxActionsEnum.enterFarm,
        description: 'Enter farm with 20 LKMEX',
        arguments: {
          token: {
            type: 'MetaESDT',
            name: 'LockedMEX',
            collection: 'LKMEX-aab910',
            identifier: 'LKMEX-aab910-04',
            ticker: 'LKMEX',
            decimals: 18,
            value: '20000000000000000000',
          },
        },
      },
    };
    expect(unwrapper(action)).toEqual(['Enter farm with', action.arguments.token]);
  });
});
