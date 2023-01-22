import BigNumber from 'bignumber.js';
import { TxActionType, TxActionsEnum, TxActionCategoryEnum, UnwrapperType } from 'types';

export const mexUnwrapper = (action: TxActionType): Array<string | UnwrapperType> => {
  switch (action.name) {
    // distribution
    case TxActionsEnum.claimLockedAssets:
      return ['Claim locked assets'];
    // farm
    case TxActionsEnum.enterFarm:
    case TxActionsEnum.enterFarmProxy: {
      return ['Enter farm with', { token: action.arguments?.transfers }];
    }
    case TxActionsEnum.enterFarmAndLockRewards:
    case TxActionsEnum.enterFarmAndLockRewardsProxy:
      return ['Enter farm and lock rewards with', { token: action.arguments?.transfers }];
    case TxActionsEnum.exitFarm:
    case TxActionsEnum.exitFarmProxy:
      return ['Exit farm with', { token: action.arguments?.transfers }];
    case TxActionsEnum.claimRewards:
    case TxActionsEnum.claimRewardsProxy:
      return ['Claim rewards', { token: action.arguments?.transfers }];
    case TxActionsEnum.compoundRewards:
    case TxActionsEnum.compoundRewardsProxy:
      return ['Reinvest rewards', { token: action.arguments?.transfers }];
    // pairs
    case TxActionsEnum.swapTokensFixedInput:
    case TxActionsEnum.swap:
      // return [
      //   'Swap',
      //   { token: [action.arguments?.transfers[0]] },
      //   'for a minimum of',
      //   { token: [action.arguments?.transfers[1]] },
      // ];
      return action.description ? [action.description] : [];
    case TxActionsEnum.swapTokensFixedOutput:
      // return [
      //   'Swap',
      //   { token: [action.arguments?.transfers[0]] },
      //   'for a maximum of',
      //   { token: [action.arguments?.transfers[1]] },
      // ];
      return action.description ? [action.description] : [];
    case TxActionsEnum.addLiquidity:
    case TxActionsEnum.addLiquidityProxy:
      return [
        'Added liquidity for',
        { token: [action.arguments?.transfers[0]] },
        'and',
        { token: [action.arguments?.transfers[1]] },
      ];
    case TxActionsEnum.removeLiquidity:
    case TxActionsEnum.removeLiquidityProxy:
      return ['Removed liquidity with ', { token: action.arguments?.transfers }];
    // wrap - commented for now until we have the proper tokens from the Api
    // case TxActionsEnum.wrapEgld:
    //   return ['Wrap' /* EGLD value */];
    // case TxActionsEnum.unwrapEgld:
    //   return ['Unwrap' /* EGLD value */];
    // case TxActionsEnum.unlockAssets:
    //   return ['Unlock', { token: action.arguments?.transfers }];
    case TxActionsEnum.mergeLockedAssetTokens:
      let value = '0';
      if (action.arguments?.transfers) {
        const values = action.arguments.transfers.map(({ value }: { value: string }) => value);
        value = BigNumber.sum.apply(null, values).toString(10);
      }
      return [
        `Merge ${action.arguments?.transfers.length}`,
        { tokenNoLink: [action.arguments?.transfers[0]] },
        'positions into a single',
        { tokenNoLink: [action.arguments?.transfers[0]] },
        'position of value',
        { value },
      ];
    case TxActionsEnum.wrapEgld:
    case TxActionsEnum.unwrapEgld:
    default:
      return action.description ? [action.description] : [];
  }
};

export const esdtNftUnwrapper = (action: TxActionType): Array<string | UnwrapperType> => {
  switch (action.name) {
    case TxActionsEnum.transfer:
      return [
        'Transfer',
        { token: action.arguments?.transfers },
        'to',
        { address: action.arguments?.receiver },
      ];

    default:
      return [];
  }
};

export const stakeUnwrapper = (action: TxActionType): Array<string | UnwrapperType> => {
  switch (action.name) {
    case TxActionsEnum.delegate:
    case TxActionsEnum.stake:
      return [
        'Delegate',
        { egldValue: action.arguments?.value },
        'to staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar,
        },
      ];
    case TxActionsEnum.unDelegate:
      return [
        'Undelegate',
        { egldValue: action.arguments?.value },
        'from staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar,
        },
      ];
    case TxActionsEnum.stakeClaimRewards:
      return [
        'Claim rewards from staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar,
        },
      ];
    case TxActionsEnum.reDelegateRewards:
      return [
        'Redelegate rewards from staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar,
        },
      ];
    case TxActionsEnum.withdraw:
      return [
        'Withdraw from staking provider',
        {
          providerName: action.arguments?.providerName,
          providerAvatar: action.arguments?.providerAvatar,
        },
      ];

    default:
      return [];
  }
};

export const unwrapper = (action: TxActionType): Array<string | UnwrapperType> => {
  if (action.arguments) {
    switch (action.category) {
      case TxActionCategoryEnum.esdtNft:
        return esdtNftUnwrapper(action);
      case TxActionCategoryEnum.mex:
        return mexUnwrapper(action);
      case TxActionCategoryEnum.stake:
        return stakeUnwrapper(action);
      default:
        return action.description ? [action.description] : [];
    }
  } else {
    return action.description ? [action.description] : [action.name];
  }
};
