import React from 'react';
import BigNumber from 'bignumber.js';

import { adapter } from 'sharedComponents';
import { useGlobalState } from 'context';
import { DelegationLegacyType, DelegationType, StakeType } from 'helpers/types';

export interface StakingDetailsType {
  show: boolean;
  bNtotalStaked: BigNumber;
  bNtotalDelegation: BigNumber;
  bNtotalLegacyDelegation: BigNumber;
  bNtotalLocked: BigNumber;
  bNtotalClaimable: BigNumber;
  stake?: StakeType;
  delegationLegacy?: DelegationLegacyType;
  delegation?: DelegationType[];
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
    show: false,
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

        const bNClaimableRewards = new BigNumber(
          accountDetails.claimableRewards ? accountDetails.claimableRewards : 0
        );
        bNtotalClaimable = bNClaimableRewards;

        if (stake) {
          bNtotalStaked = new BigNumber(stake.totalStaked ? stake.totalStaked : 0);
        }
        if (delegationLegacy) {
          const bNuserActiveStake = new BigNumber(
            delegationLegacy.userActiveStake ? delegationLegacy.userActiveStake : 0
          );
          const bNuserWaitingStake = new BigNumber(
            delegationLegacy.userWaitingStake ? delegationLegacy.userWaitingStake : 0
          );
          bNtotalLegacyDelegation = new BigNumber(bNuserActiveStake.plus(bNuserWaitingStake));
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
        if (stake && delegationLegacy && delegationLegacy) {
          bNtotalLocked = bNClaimableRewards
            .plus(bNtotalStaked)
            .plus(bNtotalLegacyDelegation)
            .plus(bNtotalDelegation);
        }
        const show = stakeFetched && delegationLegacyFetched && delegationFetched;

        setStakingDetails({
          show,
          delegation,
          stake,
          delegationLegacy,
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
