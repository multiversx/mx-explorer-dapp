import React from 'react';
import BigNumber from 'bignumber.js';

import { adapter } from 'sharedComponents';
import { useGlobalState } from 'context';
import { DelegationLegacyType, DelegationType, StakeType } from 'helpers/types';

export interface StakingDetailsType {
  dataFetched: boolean;
  bNtotalStaked: BigNumber;
  bNtotalDelegation: BigNumber;
  bNtotalLegacyDelegation: BigNumber;
  bNtotalLocked: BigNumber;
  bNtotalClaimable: BigNumber;
  stake?: StakeType;
  showStake: boolean;
  delegationLegacy?: DelegationLegacyType;
  showDelegationLegacy: boolean;
  delegation?: DelegationType[];
  showDelegation: boolean;
}

const useFetchStakingDetails = () => {
  const { accountDetails } = useGlobalState();
  const { getAccountDelegationLegacy, getAccountDelegation, getAccountStake } = adapter();
  const { address, txCount } = accountDetails;

  let bNtotalStaked = new BigNumber(0);
  let bNtotalDelegation = new BigNumber(0);
  let bNtotalLegacyDelegation = new BigNumber(0);
  let bNtotalLocked = new BigNumber(0);
  let bNtotalClaimable = new BigNumber(0);

  const [stakingDetails, setStakingDetails] = React.useState<StakingDetailsType>({
    dataFetched: false,
    showDelegation: false,
    showDelegationLegacy: false,
    showStake: false,
    bNtotalStaked,
    bNtotalDelegation,
    bNtotalLegacyDelegation,
    bNtotalLocked,
    bNtotalClaimable,
  });

  const fetchStakingDetailsAndPrice = () => {
    if (!document.hidden) {
      Promise.all([
        getAccountDelegation(address),
        getAccountStake(address),
        getAccountDelegationLegacy(address),
      ]).then(([delegationData, stakeData, delegationLegacyData]) => {
        const delegationFetched = delegationData.success ? delegationData.data : {};
        const stakeFetched = stakeData.success ? stakeData.data : {};
        const delegationLegacyFetched = delegationLegacyData.success
          ? delegationLegacyData.data
          : {};

        const delegation: DelegationType[] = delegationFetched ? delegationData.data : [];
        const stake = stakeFetched ? stakeData.data : {};
        const delegationLegacy = delegationLegacyFetched ? delegationLegacyData.data : {};

        if (stake) {
          bNtotalStaked = new BigNumber(stake.totalStaked ? stake.totalStaked : 0);
        }
        if (delegationLegacy) {
          const bNuserActiveStake = new BigNumber(delegationLegacy.userActiveStake);
          const bNuserWaitingStake = new BigNumber(delegationLegacy.userWaitingStake);
          const bNClaimableRewardsLegacy = new BigNumber(delegationLegacy.claimableRewards);
          bNtotalClaimable = bNtotalClaimable.plus(bNClaimableRewardsLegacy);
          bNtotalLegacyDelegation = new BigNumber(
            bNuserActiveStake.plus(bNuserWaitingStake).plus(bNClaimableRewardsLegacy)
          );
        }

        if (delegation && delegation.length > 0) {
          const bNtotalUserActiveStake = delegation
            .map(({ userActiveStake }) => userActiveStake)
            .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber('0'));
          const bNtotalClaimableRewards = delegation
            .map(({ claimableRewards }) => claimableRewards || '0')
            .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber('0'));
          const undelegatedAmounts = delegation
            .map(({ userUndelegatedList }) => userUndelegatedList.map(({ amount }) => amount))
            .reduce((a, b) => a.concat(b), []);
          const bNtotalUserUnStakedValue = undelegatedAmounts.reduce(
            (a, b) => new BigNumber(a).plus(b),
            new BigNumber('0')
          );
          const activePlusUnStaked = bNtotalUserActiveStake.plus(bNtotalUserUnStakedValue);
          bNtotalDelegation = bNtotalClaimableRewards.plus(activePlusUnStaked);
          bNtotalClaimable = bNtotalClaimable.plus(bNtotalClaimableRewards);
        }
        if (stake && delegation && delegationLegacy) {
          bNtotalLocked = bNtotalStaked.plus(bNtotalLegacyDelegation).plus(bNtotalDelegation);
        }

        const showDelegation = delegation
          ? delegation.filter(
              (delegation) =>
                delegation.userActiveStake !== '0' ||
                delegation.claimableRewards !== '0' ||
                delegation.userUndelegatedList?.length > 0
            ).length > 0
          : false;

        const showDelegationLegacy =
          delegationLegacy &&
          (delegationLegacy.claimableRewards !== '0' ||
            delegationLegacy.userWaitingStake !== '0' ||
            delegationLegacy.userActiveStake !== '0');

        const showStake =
          stake &&
          (stake?.totalStaked !== '0' ||
            (stake?.unstakedTokens && stake.unstakedTokens.length > 0));

        const dataFetched = stakeFetched && delegationLegacyFetched && delegationFetched;

        setStakingDetails({
          dataFetched,
          delegation,
          showDelegation,
          stake,
          showStake,
          delegationLegacy,
          showDelegationLegacy,
          bNtotalStaked,
          bNtotalDelegation,
          bNtotalLegacyDelegation,
          bNtotalLocked,
          bNtotalClaimable,
        });
      });
    }
  };

  React.useEffect(() => {
    fetchStakingDetailsAndPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txCount, address]);

  return stakingDetails;
};

export default useFetchStakingDetails;
