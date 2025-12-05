import {
  AxiosParamsApiType,
  GetTransactionsType,
  GetTokensType,
  GetTokenResourceType
} from 'types/adapter.types';

import { getTransactionsParams, getTokensParams } from '../helpers';
import { useAdapterConfig } from '../useAdapterConfig';

export const useTokenRequests = () => {
  const { provider } = useAdapterConfig();

  return {
    /* Tokens */

    getToken: (tokenId: string, { signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: `/tokens/${tokenId}`, signal, timeout }),

    getTokens: ({ signal, timeout, ...params }: GetTokensType) =>
      provider({
        url: '/tokens',
        signal,
        timeout,
        params: getTokensParams(params)
      }),

    getTokensCount: ({ signal, timeout, ...params }: GetTokensType = {}) =>
      provider({
        url: '/tokens/c',
        signal,
        timeout,
        params: getTokensParams({ isCount: true, ...params })
      }),

    getTokenTransactions: ({
      tokenId,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${tokenId}/transactions`,
        signal,
        timeout,
        params: getTransactionsParams({
          ...params
        })
      }),

    getTokenTransactionsCount: ({
      tokenId,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${tokenId}/transactions/c`,
        signal,
        timeout,
        params: getTransactionsParams({
          isCount: true,
          ...params
        })
      }),

    getTokenTransfers: ({
      tokenId,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${tokenId}/transfers`,
        signal,
        timeout,
        params: getTransactionsParams({
          ...params
        })
      }),

    getTokenTransfersCount: ({
      tokenId,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${tokenId}/transfers/c`,
        signal,
        timeout,
        params: getTransactionsParams({
          isCount: true,
          ...params
        })
      }),

    getTokenAccounts: ({
      tokenId,
      signal,
      timeout,
      ...params
    }: GetTokensType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${tokenId}/accounts`,
        signal,
        timeout,
        params: getTokensParams({ ...params })
      }),

    getTokenAccountsCount: ({
      tokenId,
      signal,
      timeout
    }: GetTokenResourceType) =>
      provider({
        url: `/tokens/${tokenId}/accounts/count`,
        signal,
        timeout
      }),

    getTokenSupply: ({ tokenId, signal, timeout }: GetTokenResourceType) =>
      provider({
        url: `/tokens/${tokenId}/supply`,
        signal,
        timeout
      })
  };
};
