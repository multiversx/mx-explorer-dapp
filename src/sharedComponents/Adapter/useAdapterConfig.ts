import { useGlobalState } from 'context';
import elasticAdapter from './elastic';
import apiAdapter from './api';
import { metaChainShardId } from 'appConfig';
import { ProviderPropsType } from './helpers';

interface PropsType {
  baseUrl?: ProviderPropsType['baseUrl'];
  proxyUrl?: ProviderPropsType['proxyUrl'];
  metaChainShardId?: number;
  url?: string;
  params?: ProviderPropsType['params'];
  timeout?: ProviderPropsType['timeout'];
  timestamp?: ProviderPropsType['timestamp'];
}

async function wrap(asyncRequest: () => Promise<any>) {
  try {
    const { data } = await asyncRequest();
    return {
      data,
      success: data !== undefined,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

export default function useAdapterConfig() {
  const {
    activeNetwork: {
      elasticUrl,
      adapter: networkAdapter,
      proxyUrl: nodeUrl,
      apiUrl,
      delegationApi,
      growthApi,
    },
    timeout,
  } = useGlobalState();

  const providers = {
    api: {
      baseUrl: apiUrl || '',
      proxyUrl: apiUrl || '',
      ...apiAdapter,
    },
    elastic: {
      baseUrl: elasticUrl || '',
      proxyUrl: nodeUrl || '',
      ...elasticAdapter,
    },
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
    getProvider,
  } = providers[adapter];

  const providerProps = { ...providers[adapter], metaChainShardId, timeout };

  const basicProps: PropsType & { url: string } = { url: '' };

  return {
    delegationApi,
    growthApi,
    provider: (props = basicProps) => wrap(() => provider({ ...providerProps, ...props })),
    getStats: (props = basicProps) => wrap(() => getStats({ ...providerProps, ...props })),
    getNodes: (props = basicProps) => wrap(() => getNodes({ ...providerProps, ...props })),
    getNodesVersions: (props = basicProps) =>
      wrap(() => getNodesVersions({ ...providerProps, ...props })),
    getShards: (props = basicProps) => wrap(() => getShards({ ...providerProps, ...props })),
    getAccountDelegation: (props = basicProps) =>
      wrap(() => getAccountDelegation({ ...providerProps, ...props })),
    getAccountDelegationLegacy: (props = basicProps) =>
      wrap(() => getAccountDelegationLegacy({ ...providerProps, ...props })),
    getAccountStake: (props = basicProps) =>
      wrap(() => getAccountStake({ ...providerProps, ...props })),
    getEconomics: (props = basicProps) => wrap(() => getEconomics({ ...providerProps, ...props })),
    getProviders: (props = basicProps) => wrap(() => getProviders({ ...providerProps, ...props })),
    getProvider: (props = basicProps) => wrap(() => getProvider({ ...providerProps, ...props })),
  };
}
