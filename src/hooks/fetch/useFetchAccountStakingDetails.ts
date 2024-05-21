import BigNumber from 'bignumber.js';
import { useDispatch } from 'react-redux';

import { LEGACY_DELEGATION_NODES_IDENTITY } from 'appConstants';
import { useAdapter } from 'hooks';
import { setAccountStaking } from 'redux/slices';
import { IdentityType, ProviderType, AccountDelegationType } from 'types';

let currentRequest: any = null;

export const useFetchAccountStakingDetails = () => {
  const dispatch = useDispatch();
  const {
    getAccountDelegationLegacy,
    getAccountDelegation,
    getAccountStake,
    getProviders,
    getIdentities
  } = useAdapter();

  const getAccountStakingDetailsOnce = ({ address }: { address: string }) => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await Promise.all([
          getAccountDelegation(address),
          getAccountStake(address),
          getAccountDelegationLegacy(address)
        ]);
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        currentRequest = null;
      }
    });

    currentRequest = requestPromise;
    return requestPromise;
  };

  const fetchAccountStakingDetails = async ({
    address
  }: {
    address: string;
  }) => {
    const [delegationData, stakeData, delegationLegacyData] =
      await getAccountStakingDetailsOnce({ address });

    let delegationLegacyIdentity: IdentityType | undefined = undefined;
    const delegationProviders: ProviderType[] = [];
    let bNtotalStaked = new BigNumber(0);
    let bNtotalDelegation = new BigNumber(0);
    let bNtotalLegacyDelegation = new BigNumber(0);
    let bNtotalLocked = new BigNumber(0);
    let bNtotalClaimable = new BigNumber(0);
    let bNtotalActiveStake = new BigNumber(0);
    let bNtotalUnstakedValue = new BigNumber(0);

    const delegationFetched = delegationData.success ? delegationData.data : {};
    const stakeFetched = stakeData.success ? stakeData.data : {};
    const delegationLegacyFetched = delegationLegacyData.success
      ? delegationLegacyData.data
      : {};

    const delegation: AccountDelegationType[] = delegationFetched
      ? delegationData.data
      : [];
    const stake = stakeFetched ? stakeData.data : {};
    const delegationLegacy = delegationLegacyFetched
      ? delegationLegacyData.data
      : {};

    if (stake) {
      bNtotalStaked = new BigNumber(stake.totalStaked ? stake.totalStaked : 0);
    }
    if (delegationLegacy) {
      const bNuserActiveStake = new BigNumber(delegationLegacy.userActiveStake);
      const bNuserWaitingStake = new BigNumber(
        delegationLegacy.userWaitingStake
      );
      const bNClaimableRewardsLegacy = new BigNumber(
        delegationLegacy.claimableRewards
      );
      bNtotalClaimable = bNtotalClaimable.plus(bNClaimableRewardsLegacy);
      bNtotalLegacyDelegation = new BigNumber(
        bNuserActiveStake
          .plus(bNuserWaitingStake)
          .plus(bNClaimableRewardsLegacy)
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
          ({ userUndelegatedList }) =>
            userUndelegatedList?.map(({ amount }) => amount) ?? []
        )
        .reduce((a, b) => a.concat(b), []);
      const bNtotalUserUnStakedValue = undelegatedAmounts.reduce(
        (a, b) => new BigNumber(a).plus(b),
        new BigNumber('0')
      );
      const activePlusUnStaked = bNtotalUserActiveStake.plus(
        bNtotalUserUnStakedValue
      );
      bNtotalActiveStake = bNtotalUserActiveStake;
      bNtotalUnstakedValue = bNtotalUserUnStakedValue;
      bNtotalDelegation = bNtotalClaimableRewards.plus(activePlusUnStaked);
      bNtotalClaimable = bNtotalClaimable.plus(bNtotalClaimableRewards);
    }
    if (stake && delegation && delegationLegacy) {
      bNtotalLocked = bNtotalStaked
        .plus(bNtotalLegacyDelegation)
        .plus(bNtotalDelegation);
    }

    const visibleDelegation =
      delegation?.filter(
        (delegation) =>
          delegation.userActiveStake !== '0' ||
          delegation.claimableRewards !== '0' ||
          (delegation.userUndelegatedList &&
            delegation.userUndelegatedList.length > 0)
      ) ?? [];
    const showDelegation = visibleDelegation.length > 0;

    const showDelegationLegacy =
      delegationLegacy &&
      (delegationLegacy.claimableRewards !== '0' ||
        delegationLegacy.userWaitingStake !== '0' ||
        delegationLegacy.userActiveStake !== '0');

    const showStake = Boolean(
      stake &&
        (stake?.totalStaked !== '0' ||
          (stake?.unstakedTokens && stake.unstakedTokens.length > 0))
    );

    //const updatedContracts = contracts ? contracts.join(',') : undefined;
    const fields = [
      'identity',
      'provider',
      'stake',
      'numNodes',
      'apr',
      'serviceFee',
      'delegationCap'
    ].join(',');
    const contracts = visibleDelegation
      .map((delegation) => delegation?.contract)
      .join(',');

    const stakingDataReady = Boolean(
      stakeFetched && delegationFetched && delegationLegacyFetched
    );
    const stakingData = {
      address,
      stakingDataReady,
      delegation,
      showDelegation,
      stake,
      showStake,
      delegationLegacy,
      showDelegationLegacy,
      totalStaked: bNtotalStaked.toString(),
      totalDelegation: bNtotalDelegation.toString(),
      totalLegacyDelegation: bNtotalLegacyDelegation.toString(),
      totalLocked: bNtotalLocked.toString(),
      totalClaimable: bNtotalClaimable.toString(),
      totalActiveStake: bNtotalActiveStake.toString(),
      totalUnstakedValue: bNtotalUnstakedValue.toString()
    };

    if (showDelegation || showDelegationLegacy) {
      getProviders({
        fields,
        ...(contracts ? { providers: contracts } : {})
      }).then((providersData) => {
        if (providersData.success) {
          const newProvidersData: ProviderType[] = providersData.data;

          const providerIdentitiesList = newProvidersData
            .filter((item) => item.identity)
            .map((item) => item.identity);

          if (
            showDelegationLegacy &&
            !providerIdentitiesList.includes(LEGACY_DELEGATION_NODES_IDENTITY)
          ) {
            providerIdentitiesList.push(LEGACY_DELEGATION_NODES_IDENTITY);
          }

          const identities = providerIdentitiesList.join(',');

          if (identities) {
            getIdentities({ identities }).then((identitiesData) => {
              if (identitiesData.success) {
                newProvidersData.forEach((provider) => {
                  if (provider.identity) {
                    const identityDetails = identitiesData.data.find(
                      (identity: IdentityType) =>
                        identity.identity === provider.identity
                    );

                    const multiversXNodes = identitiesData.data.filter(
                      (identity: IdentityType) => {
                        return (
                          identity.identity === LEGACY_DELEGATION_NODES_IDENTITY
                        );
                      }
                    );
                    if (multiversXNodes.length > 0) {
                      delegationLegacyIdentity = multiversXNodes[0];
                    }

                    if (identityDetails) {
                      provider.identityDetails = identityDetails;
                    }
                  }
                });

                dispatch(
                  setAccountStaking({
                    ...stakingData,
                    accountStakingFetched: stakingDataReady,
                    providerDataReady: true,
                    delegationProviders: newProvidersData,
                    delegationLegacyIdentity
                  })
                );
              }

              dispatch(
                setAccountStaking({
                  ...stakingData,
                  accountStakingFetched: stakingDataReady,
                  providerDataReady: true,
                  delegationProviders: newProvidersData,
                  delegationLegacyIdentity
                })
              );
            });
          } else {
            dispatch(
              setAccountStaking({
                ...stakingData,
                accountStakingFetched: stakingDataReady,
                providerDataReady: true,
                delegationProviders: providersData.data,
                delegationLegacyIdentity
              })
            );
          }
        } else {
          dispatch(
            setAccountStaking({
              ...stakingData,
              accountStakingFetched: stakingDataReady,
              providerDataReady: providersData.success,
              delegationProviders,
              delegationLegacyIdentity
            })
          );
        }
      });
    } else {
      dispatch(
        setAccountStaking({
          ...stakingData,
          accountStakingFetched: stakingDataReady,
          providerDataReady: true,
          delegationProviders,
          delegationLegacyIdentity
        })
      );
    }

    return [delegationData, stakeData, delegationLegacyData];
  };

  return { fetchAccountStakingDetails };
};
