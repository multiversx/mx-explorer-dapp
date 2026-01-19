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

    getToken: (token: string, { signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: `/tokens/${token}`, signal, timeout }),

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
      token,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${token}/transactions`,
        signal,
        timeout,
        params: getTransactionsParams({
          ...params
        })
      }),

    getTokenTransactionsCount: ({
      token,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${token}/transactions/c`,
        signal,
        timeout,
        params: getTransactionsParams({
          isCount: true,
          ...params
        })
      }),

    getTokenTransfers: ({
      token,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${token}/transfers`,
        signal,
        timeout,
        params: getTransactionsParams({
          ...params
        })
      }),

    getTokenTransfersCount: ({
      token,
      signal,
      timeout,
      ...params
    }: GetTransactionsType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${token}/transfers/c`,
        signal,
        timeout,
        params: getTransactionsParams({
          isCount: true,
          ...params
        })
      }),

    getTokenAccounts: ({
      token,
      signal,
      timeout,
      ...params
    }: GetTokensType & GetTokenResourceType) =>
      provider({
        url: `/tokens/${token}/accounts`,
        signal,
        timeout,
        params: getTokensParams({ ...params })
      }),

    getTokenAccountsCount: ({ token, signal, timeout }: GetTokenResourceType) =>
      provider({
        url: `/tokens/${token}/accounts/count`,
        signal,
        timeout
      }),

    getTokenSupply: ({ token, signal, timeout }: GetTokenResourceType) =>
      provider({
        url: `/tokens/${token}/supply`,
        signal,
        timeout
      })
  };
};
