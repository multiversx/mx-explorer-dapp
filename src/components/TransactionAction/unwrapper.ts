import BigNumber from 'bignumber.js';
import {
  TransactionActionType,
  TransactionActionEnum,
  TransactionActionCategoryEnum,
  TransactionUnwrapperType
} from 'types';

export const mexUnwrapper = (
  action: TransactionActionType
): Array<string | TransactionUnwrapperType> => {
  switch (action.name) {
    // distribution
    case TransactionActionEnum.claimLockedAssets:
      return ['Claim locked assets'];
    // farm
    case TransactionActionEnum.enterFarm:
    case TransactionActionEnum.enterFarmProxy: {
      return ['Enter farm with', { token: action.arguments?.transfers }];
    }
    case TransactionActionEnum.enterFarmAndLockRewards:
    case TransactionActionEnum.enterFarmAndLockRewardsProxy:
      return [
        'Enter farm and lock rewards with',
        { token: action.arguments?.transfers }
      ];
    case TransactionActionEnum.exitFarm:
    case TransactionActionEnum.exitFarmProxy:
      return ['Exit farm with', { token: action.arguments?.transfers }];
    case TransactionActionEnum.claimRewards:
    case TransactionActionEnum.claimRewardsProxy:
      return ['Claim rewards', { token: action.arguments?.transfers }];
    case TransactionActionEnum.compoundRewards:
    case TransactionActionEnum.compoundRewardsProxy:
      return ['Reinvest rewards', { token: action.arguments?.transfers }];
    // pairs
    case TransactionActionEnum.swapTokensFixedInput:
    case TransactionActionEnum.swap:
      // return [
      //   'Swap',
      //   { token: [action.arguments?.transfers[0]] },
      //   'for a minimum of',
      //   { token: [action.arguments?.transfers[1]] },
      // ];
      return action.description ? [action.description] : [];
    case TransactionActionEnum.swapTokensFixedOutput:
      // return [
      //   'Swap',
      //   { token: [action.arguments?.transfers[0]] },
      //   'for a maximum of',
      //   { token: [action.arguments?.transfers[1]] },
      // ];
      return action.description ? [action.description] : [];
    case TransactionActionEnum.addLiquidity:
    case TransactionActionEnum.addLiquidityProxy:
      return [
        'Added liquidity for',
        { token: [action.arguments?.transfers[0]] },
        'and',
        { token: [action.arguments?.transfers[1]] }
      ];
    case TransactionActionEnum.removeLiquidity:
    case TransactionActionEnum.removeLiquidityProxy:
      return [
        'Removed liquidity with ',
        { token: action.arguments?.transfers }
      ];
    // wrap - commented for now until we have the proper tokens from the Api
    // case TransactionActionEnum.wrapEgld:
    //   return ['Wrap' /* EGLD value */];
    // case TransactionActionEnum.unwrapEgld:
    //   return ['Unwrap' /* EGLD value */];
    // case TransactionActionEnum.unlockAssets:
    //   return ['Unlock', { token: action.arguments?.transfers }];
    case TransactionActionEnum.mergeLockedAssetTokens:
      let value = '0';
      if (action.arguments?.transfers) {
        const values = action.arguments.transfers.map(
          ({ value }: { value: string }) => value
        );
        value = BigNumber.sum.apply(null, values).toString(10);
      }
      return [
        `Merge ${action.arguments?.transfers.length}`,
        { tokenNoLink: [action.arguments?.transfers[0]] },
        'positions into a single',
        { tokenNoLink: [action.arguments?.transfers[0]] },
        'position of value',
        { value }
      ];
    case TransactionActionEnum.wrapEgld:
    case TransactionActionEnum.unwrapEgld:
    default:
      return action.description ? [action.description] : [];
  }
};

export const esdtNftUnwrapper = (
  action: TransactionActionType
): Array<string | TransactionUnwrapperType> => {
  switch (action.name) {
    case TransactionActionEnum.transfer:
      return [
        'Transfer',
        { token: action.arguments?.transfers },
        'to',
        { address: action.arguments?.receiver }
      ];

    default:
      return [];
  }
};

export const stakeUnwrapper = (
  action: TransactionActionType
): Array<string | TransactionUnwrapperType> => {
  switch (action.name) {
    case TransactionActionEnum.delegate:
    case TransactionActionEnum.stake:
      return [
        'Delegate',
        { egldValue: action.arguments?.value },
        'to staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar
        }
      ];
    case TransactionActionEnum.unDelegate:
      return [
        'Undelegate',
        { egldValue: action.arguments?.value },
        'from staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar
        }
      ];
    case TransactionActionEnum.stakeClaimRewards:
      return [
        'Claim rewards from staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar
        }
      ];
    case TransactionActionEnum.reDelegateRewards:
      return [
        'Redelegate rewards from staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar
        }
      ];
    case TransactionActionEnum.withdraw:
      return [
        'Withdraw from staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar
        }
      ];

    default:
      return [];
  }
};

export const unwrapper = (
  action: TransactionActionType
): Array<string | TransactionUnwrapperType> => {
  if (action.arguments) {
    switch (action.category) {
      case TransactionActionCategoryEnum.esdtNft:
        return esdtNftUnwrapper(action);
      case TransactionActionCategoryEnum.mex:
        return mexUnwrapper(action);
      case TransactionActionCategoryEnum.stake:
        return stakeUnwrapper(action);
      default:
        return action.description ? [action.description] : [];
    }
  } else {
    return action.description ? [action.description] : [action.name];
  }
};
