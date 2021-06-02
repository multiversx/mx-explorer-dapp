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
    activeNetwork: { elasticUrl, adapter: networkAdapter, proxyUrl: nodeUrl, apiUrl },
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
    getAccountDelegation,
    getAccountStake,
    getEconomics,
    getShards,
    getEgldPrice,
    getEgldClosingPrice,
    getEgldPriceHistory,
    getEgldMarketCapHistory,
    getEgldVolumeHistory,
    getTotalStakedHistory,
    getUsersStaking,
    getTransactionsHistory,
    getAccountsHistory,
    getProviders,
    getProvider,
    getEgldMarketCap,
  } = providers[adapter];

  const providerProps = { ...providers[adapter], metaChainShardId, timeout };

  const basicProps: PropsType & { url: string } = { url: '' };

  return {
    provider: (props = basicProps) => wrap(() => provider({ ...providerProps, ...props })),
    getStats: (props = basicProps) => wrap(() => getStats({ ...providerProps, ...props })),
    getNodes: (props = basicProps) => wrap(() => getNodes({ ...providerProps, ...props })),
    getNodesVersions: (props = basicProps) =>
      wrap(() => getNodesVersions({ ...providerProps, ...props })),
    getShards: (props = basicProps) => wrap(() => getShards({ ...providerProps, ...props })),
    getAccountDelegation: (props = basicProps) =>
      wrap(() => getAccountDelegation({ ...providerProps, ...props })),
    getAccountStake: (props = basicProps) =>
      wrap(() => getAccountStake({ ...providerProps, ...props })),
    getEconomics: (props = basicProps) => wrap(() => getEconomics({ ...providerProps, ...props })),
    getEgldPrice: (props = basicProps) => wrap(() => getEgldPrice({ ...providerProps, ...props })),
    getEgldClosingPrice: (props = basicProps) =>
      wrap(() => getEgldClosingPrice({ ...providerProps, ...props })),
    getProviders: (props = basicProps) => wrap(() => getProviders({ ...providerProps, ...props })),
    getProvider: (props = basicProps) => wrap(() => getProvider({ ...providerProps, ...props })),
    getEgldMarketCap: (props = basicProps) =>
      wrap(() => getEgldMarketCap({ ...providerProps, ...props })),
    getEgldPriceHistory: (props = basicProps) =>
      wrap(() => getEgldPriceHistory({ ...providerProps, ...props })),
    getEgldMarketCapHistory: (props = basicProps) =>
      wrap(() => getEgldMarketCapHistory({ ...providerProps, ...props })),
    getEgldVolumeHistory: (props = basicProps) =>
      wrap(() => getEgldVolumeHistory({ ...providerProps, ...props })),
    getTotalStakedHistory: (props = basicProps) =>
      wrap(() => getTotalStakedHistory({ ...providerProps, ...props })),
    getUsersStaking: (props = basicProps) =>
      wrap(() => getUsersStaking({ ...providerProps, ...props })),
    getTransactionsHistory: (props = basicProps) =>
      wrap(() => getTransactionsHistory({ ...providerProps, ...props })),
    getAccountsHistory: (props = basicProps) =>
      wrap(() => getAccountsHistory({ ...providerProps, ...props })),
  };
}
