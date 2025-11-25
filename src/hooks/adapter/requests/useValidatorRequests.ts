import {
  GetNodesType,
  GetProvidersType,
  GetIdentitiesType,
  AxiosParamsApiType,
  GetAccountResourceType,
  GetRoundsType
} from 'types/adapter.types';

import { getNodeParams, getProviderParams } from '../helpers';
import { useAdapterConfig } from '../useAdapterConfig';

export const useValidatorRequests = () => {
  const { provider } = useAdapterConfig();

  return {
    /* Nodes */
    getNode: (key: string, { signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: `/nodes/${key}`, signal, timeout }),

    getNodes: ({ signal, timeout, ...params }: GetNodesType) =>
      provider({
        url: '/nodes',
        signal,
        timeout,
        params: getNodeParams(params)
      }),

    getNodesCount: ({ signal, timeout, ...params }: GetNodesType) =>
      provider({
        url: '/nodes/c',
        signal,
        timeout,
        params: getNodeParams({ isCount: true, ...params })
      }),

    getAuctionNodes: ({ signal, timeout }: AxiosParamsApiType = {}) =>
      provider({
        url: '/nodes/auctions',
        signal,
        timeout
      }),

    getNodesVersions: ({ signal, timeout }: AxiosParamsApiType = {}) =>
      provider({
        url: '/nodes/versions',
        signal,
        timeout
      }),

    getRounds: ({ validator, shard, epoch, signal, timeout }: GetRoundsType) =>
      provider({
        url: '/rounds',
        signal,
        timeout,
        params: {
          size: 138,
          from: 0,
          validator,
          shard,
          epoch
        }
      }),

    /* Identities */
    getIdentities: ({
      identities,
      fields,
      sort,
      order,
      signal,
      timeout
    }: GetIdentitiesType) =>
      provider({
        url: '/identities',
        signal,
        timeout,
        params: {
          identities,
          ...(fields !== undefined ? { fields } : {}),
          ...(sort !== undefined ? { sort } : {}),
          ...(order !== undefined ? { order } : {})
        }
      }),

    getIdentity: (
      identity: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) => provider({ url: `/identities/${identity}`, signal, timeout }),

    /* Providers */
    getProviders: ({ signal, timeout, ...params }: GetProvidersType) =>
      provider({
        url: '/providers',
        signal,
        timeout,
        params: getProviderParams(params)
      }),

    getProvider: ({ address, signal, timeout }: GetAccountResourceType) =>
      provider({ url: `/providers/${address}`, signal, timeout })
  };
};
