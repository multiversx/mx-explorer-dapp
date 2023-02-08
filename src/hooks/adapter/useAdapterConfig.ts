import { useSelector } from 'react-redux';

import { METACHAIN_SHARD_ID, TIMEOUT } from 'appConstants';
import { activeNetworkSelector } from 'redux/selectors';
import { AdapterProviderPropsType } from 'types/adapter.types';

import { apiAdapter } from './api';
import { elasticAdapter } from './elastic';

interface PropsType {
  baseUrl?: AdapterProviderPropsType['baseUrl'];
  proxyUrl?: AdapterProviderPropsType['proxyUrl'];
  metaChainShardId?: number;
  url?: string;
  params?: AdapterProviderPropsType['params'];
  timeout?: AdapterProviderPropsType['timeout'];
  timestamp?: AdapterProviderPropsType['timestamp'];
}

async function wrap(asyncRequest: () => Promise<any>) {
  try {
    const { data } = await asyncRequest();
    return {
      data,
      success: data !== undefined
    };
  } catch (err) {
    return {
      success: false
    };
  }
}

export const useAdapterConfig = () => {
  const {
    elasticUrl,
    adapter: networkAdapter,
    proxyUrl: nodeUrl,
    apiAddress,
    growthApi
  } = useSelector(activeNetworkSelector);

  const providers = {
    api: {
      baseUrl: apiAddress || '',
      proxyUrl: apiAddress || '',
      ...apiAdapter
    },
    elastic: {
      baseUrl: elasticUrl || '',
      proxyUrl: nodeUrl || '',
      ...elasticAdapter
    }
  };

  const adapter: 'api' | 'elastic' = networkAdapter as any;

  const {
    provider,
    getStats,
    getNodes,
    getNodesVersions,
    getAccountStake,
    getAccountDelegationLegacy,
    getAccountDelegation,
    getEconomics,
    getShards,
    getProviders,
    getProvider
  } = providers[adapter];

  const providerProps = {
    ...providers[adapter],
    metaChainShardId: METACHAIN_SHARD_ID,
    timeout: TIMEOUT
  };

  const basicProps: PropsType & { url: string } = { url: '' };

  return {
    growthApi,
    provider: (props = basicProps) =>
      wrap(() => provider({ ...providerProps, ...props })),
    getStats: (props = basicProps) =>
      wrap(() => getStats({ ...providerProps, ...props })),
    getNodes: (props = basicProps) =>
      wrap(() => getNodes({ ...providerProps, ...props })),
    getNodesVersions: (props = basicProps) =>
      wrap(() => getNodesVersions({ ...providerProps, ...props })),
    getShards: (props = basicProps) =>
      wrap(() => getShards({ ...providerProps, ...props })),
    getAccountDelegation: (props = basicProps) =>
      wrap(() => getAccountDelegation({ ...providerProps, ...props })),
    getAccountDelegationLegacy: (props = basicProps) =>
      wrap(() => getAccountDelegationLegacy({ ...providerProps, ...props })),
    getAccountStake: (props = basicProps) =>
      wrap(() => getAccountStake({ ...providerProps, ...props })),
    getEconomics: (props = basicProps) =>
      wrap(() => getEconomics({ ...providerProps, ...props })),
    getProviders: (props = basicProps) =>
      wrap(() => getProviders({ ...providerProps, ...props })),
    getProvider: (props = basicProps) =>
      wrap(() => getProvider({ ...providerProps, ...props }))
  };
};
