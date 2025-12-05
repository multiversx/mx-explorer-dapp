import {
  AxiosParamsApiType,
  GetTransactionsType,
  GetCollectionsType,
  GetCollectionResourceType,
  GetNftResourceType
} from 'types/adapter.types';

import {
  getTransactionsParams,
  getCollectionsParams,
  getNftsParams
} from '../helpers';
import { useAdapterConfig } from '../useAdapterConfig';

export const useCollectionRequests = () => {
  const { provider } = useAdapterConfig();

  return {
    /* Collections */

    getCollection: (
      collection: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) => provider({ url: `/collections/${collection}`, signal, timeout }),

    getCollections: ({ signal, timeout, ...params }: GetCollectionsType) =>
      provider({
        url: '/collections',
        signal,
        timeout,
        params: getCollectionsParams(params)
      }),

    getCollectionsCount: ({
      signal,
      timeout,
      ...params
    }: GetCollectionsType = {}) =>
      provider({
        url: '/collections/c',
        signal,
        timeout,
        params: getCollectionsParams({ isCount: true, ...params })
      }),

    getCollectionNfts: ({
      collection,
      signal,
      timeout,
      ...params
    }: GetCollectionsType & GetCollectionResourceType) =>
      provider({
        url: `/collections/${collection}/nfts`,
        signal,
        timeout,
        params: getNftsParams({ ...params })
      }),

    getCollectionNftsCount: ({
      collection,
      signal,
      timeout,
      ...params
    }: GetCollectionsType & GetCollectionResourceType) =>
      provider({
        url: `/collections/${collection}/nfts/count`,
        signal,
        timeout,
        params: getNftsParams({ isCount: true, ...params })
      }),

    getCollectionTransactions: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetNftResourceType) =>
      provider({
        url: `/collections/${identifier}/transactions`,
        signal,
        timeout,
        params: getTransactionsParams({
          ...params
        })
      }),

    getCollectionTransactionsCount: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetNftResourceType) =>
      provider({
        url: `/collections/${identifier}/transactions/count`,
        signal,
        timeout,
        params: getTransactionsParams({
          isCount: true,
          ...params
        })
      }),

    getCollectionTransfers: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetNftResourceType) =>
      provider({
        url: `/collections/${identifier}/transfers`,
        signal,
        timeout,
        params: getTransactionsParams({
          ...params
        })
      }),

    getCollectionTransfersCount: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetNftResourceType) =>
      provider({
        url: `/collections/${identifier}/transfers/count`,
        signal,
        timeout,
        params: getTransactionsParams({
          isCount: true,
          ...params
        })
      })
  };
};
