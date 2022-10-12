import React, { useState } from 'react';
import BigNumber from 'bignumber.js';

import { adapter } from 'sharedComponents';
import { useGlobalState } from 'context';
import { DelegationLegacyType, DelegationType, StakeType } from 'helpers/types';
import { IdentityType, ProviderType } from 'helpers/types';

export interface StakingDetailsType {
  stakingDataReady: boolean | undefined;
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

const ELROND_NODES_IDENTITY = 'elrondcom';

const useFetchStakingDetails = () => {
  const { accountDetails } = useGlobalState();
  const {
    getAccountDelegationLegacy,
    getAccountDelegation,
    getAccountStake,
    getProviders,
    getIdentities,
  } = adapter();
  const { address, txCount } = accountDetails;

  let bNtotalStaked = new BigNumber(0);
  let bNtotalDelegation = new BigNumber(0);
  let bNtotalLegacyDelegation = new BigNumber(0);
  let bNtotalLocked = new BigNumber(0);
  let bNtotalClaimable = new BigNumber(0);

  const [stakingDetails, setStakingDetails] = useState<StakingDetailsType>({
    stakingDataReady: undefined,
    showDelegation: false,
    showDelegationLegacy: false,
    showStake: false,
    bNtotalStaked,
    bNtotalDelegation,
    bNtotalLegacyDelegation,
    bNtotalLocked,
    bNtotalClaimable,
  });

  const [providerDataReady, setProviderDataReady] = useState<boolean | undefined>(undefined);
  const [delegationProviders, setDelegationProviders] = useState<ProviderType[]>([]);
  const [delegationLegacyIdentity, setDelegationLegacyIdentity] = useState<IdentityType>();

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
            .map(
              ({ userUndelegatedList }) => userUndelegatedList?.map(({ amount }) => amount) ?? []
            )
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

        const visibleDelegation = delegation.filter(
          (delegation) =>
            delegation.userActiveStake !== '0' ||
            delegation.claimableRewards !== '0' ||
            (delegation.userUndelegatedList && delegation.userUndelegatedList.length > 0)
        );
        const showDelegation = visibleDelegation.length > 0;

        const showDelegationLegacy =
          delegationLegacy &&
          (delegationLegacy.claimableRewards !== '0' ||
            delegationLegacy.userWaitingStake !== '0' ||
            delegationLegacy.userActiveStake !== '0');

        const showStake =
          stake &&
          (stake?.totalStaked !== '0' ||
            (stake?.unstakedTokens && stake.unstakedTokens.length > 0));

        //const updatedContracts = contracts ? contracts.join(',') : undefined;
        const fields = [
          'identity',
          'provider',
          'stake',
          'numNodes',
          'apr',
          'serviceFee',
          'delegationCap',
        ].join(',');
        const contracts = visibleDelegation.map((delegation) => delegation?.contract).join(',');

        if (showDelegation || showDelegationLegacy) {
          getProviders({
            fields,
            ...(contracts ? { providers: contracts } : {}),
          }).then((providersData) => {
            if (providersData.success) {
              let newProvidersData: ProviderType[] = providersData.data;

              const providerIdentitiesList = newProvidersData
                .filter((item) => item.identity)
                .map((item) => item.identity);

              if (showDelegationLegacy && !providerIdentitiesList.includes(ELROND_NODES_IDENTITY)) {
                providerIdentitiesList.push(ELROND_NODES_IDENTITY);
              }

              const identities = providerIdentitiesList.join(',');

              if (identities) {
                getIdentities(identities).then((identitiesData) => {
                  if (identitiesData.success) {
                    newProvidersData.forEach((provider) => {
                      if (provider.identity) {
                        const identityDetails = identitiesData.data.find(
                          (identity: IdentityType) => identity.identity === provider.identity
                        );

                        const elrondNodes = identitiesData.data.filter((identity: IdentityType) => {
                          return identity.identity === ELROND_NODES_IDENTITY;
                        });
                        if (elrondNodes.length > 0) {
                          setDelegationLegacyIdentity(elrondNodes[0]);
                        }

                        if (identityDetails) {
                          provider.identityDetails = identityDetails;
                        }
                      }
                    });
                  }

                  setDelegationProviders(newProvidersData);
                });
              } else {
                setDelegationProviders(providersData.data);
              }
              setProviderDataReady(true);
            } else {
              setProviderDataReady(providersData.success);
            }
          });
        } else {
          setProviderDataReady(true);
        }

        const stakingDataReady = stakeFetched && delegationFetched && delegationLegacyFetched;

        setStakingDetails({
          stakingDataReady,
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

  return {
    ...stakingDetails,
    providerDataReady,
    delegationProviders,
    delegationLegacyIdentity,
  };
};

export default useFetchStakingDetails;
