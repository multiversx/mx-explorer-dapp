import { useDispatch } from 'react-redux';

import { LEGACY_DELEGATION_NODES_IDENTITY } from 'appConstants';
import { getAccountStakingDetails } from 'helpers';
import { useAdapter } from 'hooks';
import { setAccountStaking } from 'redux/slices';
import {
  IdentityType,
  ProviderType,
  AccountDelegationType,
  ApiAdapterResponseType
} from 'types';

let currentRequest: any = null;

export const useFetchAccountStakingDetails = () => {
  const dispatch = useDispatch();
  const {
    getAccountDelegationLegacy,
    getAccountDelegation,
    getAccountStake,
    getProviders,
    getIdentity
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

    const delegationFetched = delegationData.success && delegationData.data;
    const stakeFetched = stakeData.success && stakeData.data;
    const delegationLegacyFetched =
      delegationLegacyData.success && delegationLegacyData.data;

    const delegation: AccountDelegationType[] = delegationFetched
      ? delegationData.data
      : [];
    const stake = stakeFetched ? stakeData.data : {};
    const legacyDelegation = delegationLegacyFetched
      ? delegationLegacyData.data
      : {};

    const stakingDetails = getAccountStakingDetails({
      delegation,
      stake,
      legacyDelegation
    });
    const { showDelegation, showLegacyDelegation } = stakingDetails;

    const accountStakingFetched = Boolean(
      stakeFetched && delegationFetched && delegationLegacyFetched
    );
    const stakingData = {
      address,
      stake,
      legacyDelegation,
      delegation,
      ...stakingDetails
    };

    if (showDelegation || showLegacyDelegation) {
      const fields = [
        'identity',
        'provider',
        'stake',
        'numNodes',
        'apr',
        'serviceFee',
        'delegationCap'
      ].join(',');
      const providers = showDelegation
        ? delegation.map((delegation) => delegation?.contract).join(',')
        : '';

      const [providersData, legacyIdentityData] = await Promise.all([
        providers
          ? getProviders({
              fields,
              providers,
              withIdentityInfo: true
            })
          : Promise.resolve({ success: true } as ApiAdapterResponseType),

        showLegacyDelegation
          ? getIdentity(LEGACY_DELEGATION_NODES_IDENTITY)
          : Promise.resolve({ success: true } as ApiAdapterResponseType)
      ]);

      dispatch(
        setAccountStaking({
          ...stakingData,
          accountStakingFetched,
          providerDataReady: providersData.success,
          delegationProviders: providersData?.data,
          delegationLegacyIdentity: legacyIdentityData?.data
        })
      );
    } else {
      const delegationLegacyIdentity: IdentityType | undefined = undefined;
      const delegationProviders: ProviderType[] = [];

      dispatch(
        setAccountStaking({
          ...stakingData,
          accountStakingFetched,
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
