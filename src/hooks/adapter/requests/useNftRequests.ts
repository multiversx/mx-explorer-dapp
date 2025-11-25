import {
  AxiosParamsApiType,
  GetTransactionsType,
  GetNftsType,
  GetNftResourceType
} from 'types/adapter.types';

import { getTransactionsParams, getNftsParams } from '../helpers';
import { useAdapterConfig } from '../useAdapterConfig';

export const useNftRequests = () => {
  const { provider } = useAdapterConfig();

  return {
    /* NFTs */

    getNft: (
      identifier: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) => provider({ url: `/nfts/${identifier}`, signal, timeout }),

    getNfts: ({ signal, timeout, ...params }: GetNftsType) =>
      provider({
        url: '/nfts',
        signal,
        timeout,
        params: getNftsParams({ ...params, includeFlagged: true })
      }),

    getNftsCount: ({ signal, timeout, ...params }: GetNftsType) =>
      provider({
        url: '/nfts/c',
        signal,
        timeout,
        params: getNftsParams({
          ...params,
          isCount: true
        })
      }),

    getNftAccounts: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetNftsType & GetNftResourceType) =>
      provider({
        url: `/nfts/${identifier}/accounts`,
        signal,
        timeout,
        params: getNftsParams({ ...params, includeFlagged: true })
      }),

    getNftAccountsCount: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetNftsType & GetNftResourceType) =>
      provider({
        url: `/nfts/${identifier}/accounts/count`,
        signal,
        timeout,
        params: getNftsParams({ isCount: true, ...params })
      }),

    getNftTransactions: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetNftResourceType) =>
      provider({
        url: `/nfts/${identifier}/transactions`,
        signal,
        timeout,
        params: getTransactionsParams({
          ...params
        })
      }),

    getNftTransactionsCount: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetNftResourceType) =>
      provider({
        url: `/nfts/${identifier}/transactions/count`,
        signal,
        timeout,
        params: getTransactionsParams({
          isCount: true,
          ...params
        })
      }),

    getNftTransfers: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetNftResourceType) =>
      provider({
        url: `/nfts/${identifier}/transfers`,
        signal,
        timeout,
        params: getTransactionsParams({
          ...params
        })
      }),

    getNftTransfersCount: ({
      identifier,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetNftResourceType) =>
      provider({
        url: `/nfts/${identifier}/transfers/count`,
        signal,
        timeout,
        params: getTransactionsParams({
          isCount: true,
          ...params
        })
      })
  };
};
