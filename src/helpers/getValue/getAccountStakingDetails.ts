import BigNumber from 'bignumber.js';

import {
  getAccountDelegationDetails,
  getAccountLegacyDelegationDetails,
  getAccountValidatorStakeDetails
} from 'helpers';
import {
  AccountDelegationType,
  AccountDelegationLegacyType,
  AccountStakeType
} from 'types';

export const getAccountStakingDetails = ({
  stake,
  delegation,
  legacyDelegation
}: {
  stake: AccountStakeType;
  delegation: AccountDelegationType[];
  legacyDelegation: AccountDelegationLegacyType;
}) => {
  const {
    active: activeDelegation,
    claimable: claimableDelegation,
    unstaked: unstakedDelegation,
    locked: lockedDelegation,
    show: showDelegation
  } = getAccountDelegationDetails(delegation);

  const {
    active: activeLegacyDelegation,
    claimable: claimableLegacyDelegation,
    unstaked: unstakedLegacyDelegation,
    locked: lockedLegacyDelegation,
    show: showLegacyDelegation
  } = getAccountLegacyDelegationDetails(legacyDelegation);

  const {
    active: activeValidatorStake,
    unstaked: unstakedValidatorStake,
    locked: lockedValidatorStake,
    show: showValidatorStake
  } = getAccountValidatorStakeDetails(stake);

  const totalActiveStake = activeDelegation
    .plus(activeLegacyDelegation)
    .plus(activeValidatorStake);
  const totalLocked = new BigNumber(lockedDelegation)
    .plus(lockedLegacyDelegation)
    .plus(lockedValidatorStake);
  const totalClaimable = new BigNumber(claimableDelegation).plus(
    claimableLegacyDelegation
  );
  const totalUnstaked = unstakedDelegation
    .plus(unstakedLegacyDelegation)
    .plus(unstakedValidatorStake);

  const showStakingDetails =
    showDelegation || showLegacyDelegation || showValidatorStake;

  return {
    showDelegation,
    showLegacyDelegation,
    showValidatorStake,
    showStakingDetails,

    activeValidatorStake: activeValidatorStake.toString(10),
    activeDelegation: activeDelegation.toString(10),
    activeLegacyDelegation: activeLegacyDelegation.toString(10),

    lockedValidatorStake: lockedValidatorStake.toString(10),
    lockedDelegation: lockedDelegation.toString(10),
    lockedLegacyDelegation: lockedLegacyDelegation.toString(10),

    totalActiveStake: totalActiveStake.toString(10),
    totalLocked: totalLocked.toString(10),
    totalClaimable: totalClaimable.toString(10),
    totalUnstaked: totalUnstaked.toString(10)
  };
};
