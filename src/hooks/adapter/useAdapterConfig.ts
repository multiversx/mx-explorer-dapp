import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { METACHAIN_SHARD_ID, TIMEOUT } from 'appConstants';
import { activeNetworkSelector } from 'redux/selectors';
import {
  NetworkAdapterEnum,
  AdapterProviderPropsType,
  ApiAdapterResponseType
} from 'types/adapter.types';

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
  signal?: AdapterProviderPropsType['signal'];
}

async function wrap(asyncRequest: () => Promise<ApiAdapterResponseType>) {
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
    apiAddress
  } = useSelector(activeNetworkSelector);

  return useMemo(() => {
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

    const adapter = networkAdapter as NetworkAdapterEnum;

    const { provider } = providers[adapter];

    const providerProps = {
      metaChainShardId: METACHAIN_SHARD_ID,
      timeout: TIMEOUT,
      ...providers[adapter]
    };

    const basicProps: PropsType & { url: string } = { url: '' };

    return {
      provider: (props = basicProps) =>
        wrap(() => provider({ ...providerProps, ...props }))
    };
  }, [apiAddress, elasticUrl, nodeUrl, networkAdapter]);
};
