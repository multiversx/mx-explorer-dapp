import { TRANSACTIONS_TABLE_FIELDS } from 'appConstants';
import { GetEventsType } from 'types';
import {
  AxiosParamsApiType,
  BaseApiType,
  GetTransactionsType,
  GetTransactionsInPoolType
} from 'types/adapter.types';

import {
  getTransactionsParams,
  getTransactionsInPoolParams,
  getPageParams,
  getEventsParams
} from '../helpers';
import { useAdapterConfig } from '../useAdapterConfig';

export const useTransactionRequests = () => {
  const { provider } = useAdapterConfig();

  return {
    getLatestTransactions: ({
      size = 5,
      withUsername = true,
      signal,
      timeout
    }: GetTransactionsType) =>
      provider({
        url: '/transactions',
        signal,
        timeout,
        params: {
          size,
          withUsername,
          fields: TRANSACTIONS_TABLE_FIELDS.join(',')
        }
      }),

    /* Transactions */

    getTransaction: (
      transactionId: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) => provider({ url: `/transactions/${transactionId}`, signal, timeout }),

    getTransactions: ({ signal, timeout, ...params }: GetTransactionsType) =>
      provider({
        url: '/transactions',
        signal,
        timeout,
        params: getTransactionsParams(params)
      }),

    getTransactionsCount: ({
      signal,
      timeout,
      ...params
    }: GetTransactionsType = {}) =>
      provider({
        url: '/transactions/c',
        signal,
        timeout,
        params: getTransactionsParams({ isCount: true, ...params })
      }),

    getTransfers: ({ signal, timeout, ...params }: GetTransactionsType) =>
      provider({
        url: '/transfers',
        signal,
        timeout,
        params: getTransactionsParams(params)
      }),

    getTransfersCount: ({
      signal,
      timeout,
      ...params
    }: GetTransactionsType = {}) =>
      provider({
        url: '/transfers/c',
        signal,
        timeout,
        params: getTransactionsParams({ isCount: true, ...params })
      }),

    /* SC Results */

    getScResult: (hash: string, { signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: `/results/${hash}`, signal, timeout }),

    getScResults: ({ page, size, searchAfter, signal, timeout }: BaseApiType) =>
      provider({
        url: '/results',
        signal,
        timeout,
        params: getPageParams({ page, size, searchAfter })
      }),

    getScResultsCount: ({ signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: '/results/c', signal, timeout }),

    /* Events */

    getEvent: (hash: string, { signal, timeout }: AxiosParamsApiType = {}) =>
      provider({ url: `/events/${hash}`, signal, timeout }),

    getEvents: ({ signal, timeout, ...params }: GetEventsType) =>
      provider({
        url: '/events',
        signal,
        timeout,
        params: getEventsParams(params)
      }),

    getEventsCount: ({ signal, timeout, ...params }: GetEventsType = {}) =>
      provider({
        url: '/events/count',
        signal,
        timeout,
        params: getEventsParams({ isCount: true, ...params })
      }),

    /* Transactions Pool */

    getTransactionInPool: (
      hash: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) => provider({ url: `/pool/${hash}`, signal, timeout }),

    getTransactionsInPool: ({
      signal,
      timeout,
      ...params
    }: GetTransactionsInPoolType) =>
      provider({
        url: '/pool',
        signal,
        timeout,
        params: getTransactionsInPoolParams(params)
      }),

    getTransactionsInPoolCount: ({
      signal,
      timeout,
      ...params
    }: GetTransactionsInPoolType = {}) =>
      provider({
        url: '/pool/c',
        signal,
        timeout,
        params: getTransactionsInPoolParams({ isCount: true, ...params })
      })
  };
};
