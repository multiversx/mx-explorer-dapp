import BigNumber from 'bignumber.js';

import { ZERO } from 'appConstants';
import { AccountDelegationLegacyType } from 'types';

export const getAccountLegacyDelegationDetails = (
  delegationLegacy: AccountDelegationLegacyType
) => {
  if (delegationLegacy) {
    const bNactive = new BigNumber(delegationLegacy.userActiveStake ?? ZERO);
    const bNuserWaitingStake = new BigNumber(
      delegationLegacy.userWaitingStake ?? ZERO
    );
    const bNclaimableRewards = new BigNumber(
      delegationLegacy.claimableRewards ?? ZERO
    );
    const bNunstakedStakeLegacy = new BigNumber(
      delegationLegacy.userUnstakedStake ?? ZERO
    );
    const bNdeferredPaymentLegacy = new BigNumber(
      delegationLegacy.userDeferredPaymentStake ?? ZERO
    );
    const bNwithdrawOnlyStakeLegacy = new BigNumber(
      delegationLegacy.userWithdrawOnlyStake ?? ZERO
    );

    const bNunstaked = bNunstakedStakeLegacy.plus(bNdeferredPaymentLegacy);
    const bNlocked = bNactive
      .plus(bNuserWaitingStake)
      .plus(bNclaimableRewards)
      .plus(bNunstakedStakeLegacy)
      .plus(bNdeferredPaymentLegacy)
      .plus(bNwithdrawOnlyStakeLegacy);

    const show = bNlocked.isGreaterThan(0);

    return {
      active: bNactive,
      unstaked: bNunstaked,
      claimable: bNclaimableRewards,
      locked: bNlocked,
      show
    };
  }

  return {
    active: new BigNumber(ZERO),
    unstaked: new BigNumber(ZERO),
    claimable: new BigNumber(ZERO),
    locked: new BigNumber(ZERO),
    show: false
  };
};
