import { TxActionType, TokenArgumentType, TxActionsEnum } from 'helpers/types';

const unwrapper = (action: TxActionType): Array<string | TokenArgumentType> => {
  switch (action.name) {
    // distribution
    case TxActionsEnum.claimLockedAssets:
      return ['Claim locked assets'];
    // farm
    case TxActionsEnum.enterFarm:
    case TxActionsEnum.enterFarmProxy: {
      return ['Enter farm with', action.arguments.token];
    }
    case TxActionsEnum.enterFarmAndLockRewards:
    case TxActionsEnum.enterFarmAndLockRewardsProxy:
      return ['Enter farm and lock rewards with', action.arguments.token];
    case TxActionsEnum.exitFarm:
    case TxActionsEnum.exitFarmProxy:
      return ['Exit farm with', action.arguments.token];
    case TxActionsEnum.claimRewards:
    case TxActionsEnum.claimRewardsProxy:
      return ['Claim rewards', action.arguments.token];
    case TxActionsEnum.compoundRewards:
    case TxActionsEnum.compoundRewardsProxy:
      return ['Reinvest rewards', action.arguments.token];
    // pairs
    case TxActionsEnum.swapTokensFixedInput:
      return ['Swap', action.arguments.token1, 'for', action.arguments.token2];
    case TxActionsEnum.addLiquidity:
    case TxActionsEnum.addLiquidityProxy:
      return ['Added liquidity for', action.arguments.token1, 'and', action.arguments.token2];
    case TxActionsEnum.removeLiquidity:
    case TxActionsEnum.removeLiquidityProxy:
      return ['Removed liquidity', action.arguments.token1, 'for', action.arguments.token2];
    // wrap
    case TxActionsEnum.wrapEgld:
      return ['Wrap' /* EGLD value */];
    case TxActionsEnum.unwrapEgld:
      return ['Unwrap' /* EGLD value */];
    default:
      return [];
  }
};

export default unwrapper;
