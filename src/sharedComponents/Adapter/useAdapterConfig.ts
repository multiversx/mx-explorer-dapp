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
    activeNetwork: { elasticUrl, adapter, proxyUrl: nodeUrl, apiUrl },
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

  const { provider, getStats, getNodes, getRewards, getShards } = providers[adapter];

  const providerProps = { ...providers[adapter], metaChainShardId, timeout };

  const basicProps: PropsType & { url: string } = { url: '' };

  return {
    provider: (props = basicProps) => wrap(() => provider({ ...providerProps, ...props })),
    getStats: (props = basicProps) => wrap(() => getStats({ ...providerProps, ...props })),
    getNodes: (props = basicProps) => wrap(() => getNodes({ ...providerProps, ...props })),
    getShards: (props = basicProps) => wrap(() => getShards({ ...providerProps, ...props })),
    getRewards: (address: string) =>
      wrap(() => getRewards({ ...providerProps, ...basicProps, address })),
  };
}
