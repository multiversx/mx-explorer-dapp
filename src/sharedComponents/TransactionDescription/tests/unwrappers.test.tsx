import unwrapper from '../unwrapper';
import { TxActionsEnum } from 'helpers/types';

// file.only
describe('Tx Description unwrapper tests', () => {
  test('Token Transfer', () => {
    const { action } = {
      action: {
        category: 'esdtNft',
        name: TxActionsEnum.transfer,
        description:
          'Transfer 2950.00 USDC-c76f1f to erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
        arguments: {
          transfers: [
            {
              collection: 'USDC-c76f1f',
              identifier: 'USDC-c76f1f',
              ticker: 'USDC',
              name: 'WrappedUSDC',
              value: '2950000000',
            },
          ],
          receiver: 'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
        },
      },
    };
    expect(unwrapper(action)).toEqual([
      'Transfer',
      action.arguments.transfers,
      'to',
      action.arguments.receiver,
    ]);
  });
  test('NFT Transfer', () => {
    const { action } = {
      action: {
        category: 'esdtNft',
        name: 'transfer',
        description:
          'Transfer NFT ARTCRAFT-322c6e-11 to erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
        arguments: {
          transfers: [
            {
              type: 'NonFungibleESDT',
              collection: 'ARTCRAFT-322c6e',
              identifier: 'ARTCRAFT-322c6e-11',
              ticker: 'ARTCRAFT-322c6e',
              name: 'Hope',
              value: '1',
            },
          ],
          receiver: 'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
        },
      },
    };
    expect(unwrapper(action)).toEqual([
      'Transfer',
      action.arguments.transfers,
      'to',
      action.arguments.receiver,
    ]);
  });
  test('MetaESDT Transfer', () => {
    const { action } = {
      action: {
        category: 'esdtNft',
        name: 'transfer',
        description:
          'Transfer 1.537276176898979513 LKFARM (LKFARM-9d1ea8-126c17) to erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
        arguments: {
          transfers: [
            {
              type: 'MetaESDT',
              collection: 'LKFARM-9d1ea8',
              identifier: 'LKFARM-9d1ea8-126c17',
              ticker: 'LKFARM',
              name: 'LockedLPStaked',
              value: '1537276176898979513',
              decimals: 18,
            },
          ],
          receiver: 'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
        },
      },
    };
    expect(unwrapper(action)).toEqual([
      'Transfer',
      action.arguments.transfers,
      'to',
      action.arguments.receiver,
    ]);
  });
  //TODO claimlockedassets
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
  test('Enter farm and lock rewards', () => {
    const { action } = {
      action: {
        category: 'mex',
        name: TxActionsEnum.enterFarmAndLockRewards,
        description: 'Enter farm and lock rewards with 61.229451140721546841 EGLDMEX',
        arguments: {
          token: {
            name: 'EGLDMEXLP',
            collection: 'EGLDMEX-0be9e5',
            identifier: 'EGLDMEX-0be9e5',
            ticker: 'EGLDMEX',
            value: '61229451140721546841',
          },
        },
      },
    };
    expect(unwrapper(action)).toEqual(['Enter farm and lock rewards with', action.arguments.token]);
  });
  test('Exit farm', () => {
    const { action } = {
      action: {
        category: 'mex',
        name: TxActionsEnum.exitFarm,
        description: 'Exit farm with 1358392.837361997848576 LKFARM',
        arguments: {
          token: {
            type: 'MetaESDT',
            name: 'LockedLPStaked',
            collection: 'LKFARM-9d1ea8',
            identifier: 'LKFARM-9d1ea8-7ff1',
            ticker: 'LKFARM',
            decimals: 18,
            value: '1358392837361997848576000',
          },
        },
      },
    };
    expect(unwrapper(action)).toEqual(['Exit farm with', action.arguments.token]);
  });
  test('Claim rewards', () => {
    const { action } = {
      action: {
        category: 'mex',
        name: TxActionsEnum.claimRewards,
        description: 'Claim rewards 8.113902227485916134 LKFARM',
        arguments: {
          token: {
            type: 'MetaESDT',
            name: 'LockedLPStaked',
            collection: 'LKFARM-9d1ea8',
            identifier: 'LKFARM-9d1ea8-016711',
            ticker: 'LKFARM',
            decimals: 18,
            value: '8113902227485916134',
          },
        },
      },
    };
    expect(unwrapper(action)).toEqual(['Claim rewards', action.arguments.token]);
  });
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
  test('Swap tokens', () => {
    const { action } = {
      action: {
        category: 'mex',
        name: TxActionsEnum.swap,
        description: 'Swap 1 WEGLD for 281066.754391919467235791 MEX',
        arguments: {
          token1: {
            name: 'WrappedEGLD',
            collection: 'WEGLD-bd4d79',
            identifier: 'WEGLD-bd4d79',
            ticker: 'WEGLD',
            value: '1000000000000000000',
          },
          token2: {
            name: 'MEX',
            collection: 'MEX-455c57',
            identifier: 'MEX-455c57',
            ticker: 'MEX',
            value: '281066754391919467235791',
          },
        },
      },
    };
    expect(unwrapper(action)).toEqual([
      'Swap',
      action.arguments.token1,
      'for',
      action.arguments.token2,
    ]);
  });
  test('Add liquidity', () => {
    const { action } = {
      action: {
        category: 'mex',
        name: TxActionsEnum.addLiquidity,
        description:
          'Added liquidity for 0.309893556225986569 WEGLD and 88246.97734239037166522 MEX',
        arguments: {
          token1: {
            name: 'WrappedEGLD',
            collection: 'WEGLD-bd4d79',
            identifier: 'WEGLD-bd4d79',
            ticker: 'WEGLD',
            value: '309893556225986569',
          },
          token2: {
            name: 'MEX',
            collection: 'MEX-455c57',
            identifier: 'MEX-455c57',
            ticker: 'MEX',
            value: '88246977342390371665220',
          },
        },
      },
    };
    expect(unwrapper(action)).toEqual([
      'Added liquidity for',
      action.arguments.token1,
      'and',
      action.arguments.token2,
    ]);
  });
  test('Remove liquidity', () => {
    const { action } = {
      action: {
        category: 'mex',
        name: TxActionsEnum.removeLiquidity,
        description: 'Removed liquidity 0.297 EGLDMEX',
        arguments: {
          token: {
            name: 'EGLDMEXLP',
            collection: 'EGLDMEX-0be9e5',
            identifier: 'EGLDMEX-0be9e5',
            ticker: 'EGLDMEX',
            value: '297000000000000000',
          },
        },
      },
    };
    expect(unwrapper(action)).toEqual(['Removed liquidity', action.arguments.token]);
  });
});
