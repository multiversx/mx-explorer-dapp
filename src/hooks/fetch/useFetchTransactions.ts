import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { MAX_TRANSACTIONS_PAGE_SIZE, PAGE_SIZE } from 'appConstants';
import {
  useGetPage,
  useGetTransactionFilters,
  useRegisterWebsocketListener
} from 'hooks';
import { transactionsSelector } from 'redux/selectors';
import { setTransactions } from 'redux/slices';
import {
  ApiAdapterResponseType,
  TransactionType,
  WebsocketEventsEnum,
  WebsocketSubcriptionsEnum
} from 'types';

export interface FetchTransactionsProps {
  transactionPromise: (params?: any) => Promise<ApiAdapterResponseType>;
  transactionCountPromise: (params?: any) => Promise<ApiAdapterResponseType>;
  filters?: Record<string, any>;
  subscription?: WebsocketSubcriptionsEnum;
  event?: WebsocketEventsEnum;
  config?: Record<string, any>;
}

export const useFetchTransactions = ({
  transactionPromise,
  transactionCountPromise,
  filters = {},
  subscription,
  event,
  config = {}
}: FetchTransactionsProps) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const urlParams = useGetTransactionFilters();
  const { page, size } = useGetPage();

  const { transactions, transactionsCount, isDataReady, isWebsocket } =
    useSelector(transactionsSelector);

  const [dataChanged, setDataChanged] = useState<boolean>(false);
  let isCalled = false;
  const maxTransactionsSize =
    size > MAX_TRANSACTIONS_PAGE_SIZE ? MAX_TRANSACTIONS_PAGE_SIZE : size;

  // Default Transactions Updater, subscribe to websocket events on default Tx flow
  const onWebsocketEvent = (event: TransactionType[]) => {
    if (Boolean(searchParams.toString())) {
      return;
    }

    dispatch(
      setTransactions({
        transactions: event ?? [],
        transactionsCount: transactionsCount ?? event.length ?? 0,
        isWebsocket: true,
        isDataReady: true
      })
    );
  };

  useRegisterWebsocketListener({
    subscription,
    event,
    config: { from: 0, size: PAGE_SIZE, ...config, ...filters },
    onEvent: onWebsocketEvent
  });

  const fetchTransactions = (paramsChange = false) => {
    if ((isWebsocket && !paramsChange) || isCalled) {
      return;
    }

    isCalled = true;
    if (searchParams.toString() && paramsChange) {
      setDataChanged(true);
    }
    Promise.all([
      transactionPromise({
        ...urlParams,
        ...filters,
        page,
        size: maxTransactionsSize
      }),
      transactionCountPromise({ ...urlParams, ...filters })
    ])
      .then(([transactionsData, transactionsCountData]) => {
        dispatch(
          setTransactions({
            transactions: transactionsData.data ?? [],
            transactionsCount: transactionsCountData.data ?? 0,
            isWebsocket: false,
            isDataReady:
              transactionsData.success && transactionsCountData.success
          })
        );
      })
      .finally(() => {
        if (paramsChange) {
          isCalled = false;
          setDataChanged(false);
        }
      });
  };

  return {
    transactions,
    totalTransactions: transactionsCount,
    isDataReady,
    fetchTransactions,
    dataChanged
  };
};
