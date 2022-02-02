import BigNumber from 'bignumber.js';
import { TxActionType, TxActionsEnum, TxActionCategoryEnum, UnwrapperType } from 'helpers/types';

const mexUnwrapper = (action: TxActionType): Array<string | UnwrapperType> => {
  switch (action.name) {
    // distribution
    case TxActionsEnum.claimLockedAssets:
      return ['Claim locked assets'];
    // farm
    case TxActionsEnum.enterFarm:
    case TxActionsEnum.enterFarmProxy: {
      return ['Enter farm with', { token: [action.arguments?.token] }];
    }
    case TxActionsEnum.enterFarmAndLockRewards:
    case TxActionsEnum.enterFarmAndLockRewardsProxy:
      return ['Enter farm and lock rewards with', { token: [action.arguments?.token] }];
    case TxActionsEnum.exitFarm:
    case TxActionsEnum.exitFarmProxy:
      return ['Exit farm with', { token: [action.arguments?.token] }];
    case TxActionsEnum.claimRewards:
    case TxActionsEnum.claimRewardsProxy:
      return ['Claim rewards', { token: [action.arguments?.token] }];
    case TxActionsEnum.compoundRewards:
    case TxActionsEnum.compoundRewardsProxy:
      return ['Reinvest rewards', { token: [action.arguments?.token] }];
    // pairs
    case TxActionsEnum.swapTokensFixedInput:
    case TxActionsEnum.swapTokensFixedOutput:
    case TxActionsEnum.swap:
      return [
        'Swap',
        { token: [action.arguments?.token1] },
        'for a minimum of',
        { token: [action.arguments?.token2] },
      ];
    case TxActionsEnum.addLiquidity:
    case TxActionsEnum.addLiquidityProxy:
      return [
        'Added liquidity for',
        { token: [action.arguments?.token1] },
        'and',
        { token: [action.arguments?.token2] },
      ];
    case TxActionsEnum.removeLiquidity:
    case TxActionsEnum.removeLiquidityProxy:
      return ['Removed liquidity', { token: [action.arguments?.token] }];
    // wrap - commented for now until we have the proper tokens from the Api
    // case TxActionsEnum.wrapEgld:
    //   return ['Wrap' /* EGLD value */];
    // case TxActionsEnum.unwrapEgld:
    //   return ['Unwrap' /* EGLD value */];
    case TxActionsEnum.unlockAssets:
      return ['Unlock', { token: action.arguments?.transfers }];
    case TxActionsEnum.mergeLockedAssetTokens:
      let value = '0';
      if (action.arguments?.transfers) {
        const values = action.arguments.transfers.map(({ value }: { value: string }) => value);
        value = BigNumber.sum(values).toString(10);
      }
      return [
        `Merge ${action.arguments?.transfers.length}`,
        { tokenNoValue: action.arguments?.transfers },
        'positions into a single',
        { tokenNoValue: action.arguments?.transfers },
        'position of value',
        { value },
      ];
    case TxActionsEnum.wrapEgld:
    case TxActionsEnum.unwrapEgld:
    default:
      return action.description ? [action.description] : [];
  }
};

const esdtNftUnwrapper = (action: TxActionType): Array<string | UnwrapperType> => {
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

const stakeUnwrapper = (action: TxActionType): Array<string | UnwrapperType> => {
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

const unwrapper = (action: TxActionType): Array<string | UnwrapperType> => {
  if (action.arguments) {
    switch (action.category) {
      case TxActionCategoryEnum.esdtNft:
        return esdtNftUnwrapper(action);
      case TxActionCategoryEnum.mex:
        return mexUnwrapper(action);
      case TxActionCategoryEnum.stake:
        return stakeUnwrapper(action);
      default:
        return [];
    }
  } else {
    return [action.name];
  }
};

export default unwrapper;
