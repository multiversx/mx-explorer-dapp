import { AxiosParamsApiType } from 'types/adapter.types';

import { useAdapterConfig } from '../useAdapterConfig';

export const useGeneralRequests = () => {
  const { provider } = useAdapterConfig();

  return {
    getStats: ({ signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: '/stats', signal, timeout }),

    getStake: ({ signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: '/stake', signal, timeout }),

    getEconomics: ({ signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: '/economics', signal, timeout }),

    getShards: ({ signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: '/shards', signal, timeout }),

    getMarkers: (
      baseUrl: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) =>
      provider({
        url: '',
        signal,
        timeout,
        baseUrl
      }),

    // Network Config
    getDappConfig: (
      baseUrl?: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) =>
      provider({
        url: '/dapp/config',
        signal,
        timeout,
        ...(baseUrl ? { baseUrl } : {})
      }),

    getNetworkConfig: (
      baseUrl?: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) =>
      provider({
        url: '/network/config',
        signal,
        timeout,
        ...(baseUrl ? { baseUrl } : {})
      }),

    getWebsocketConfig: (
      baseUrl?: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) =>
      provider({
        url: '/websocket/config',
        signal,
        timeout,
        ...(baseUrl ? { baseUrl } : {})
      })
  };
};
