import { useDispatch, useSelector } from 'react-redux';

import { ELLIPSIS, MAX_TRANSACTIONS_PAGE_SIZE } from 'appConstants';
import { useGetPage, useGetTransactionFilters } from 'hooks';
import { transactionsSelector } from 'redux/selectors';
import { setTransactions } from 'redux/slices';
import { TransactionType } from 'types';
import { FetchApiDataProps, useFetchApiData } from './useFetchApiData';

export interface FetchTransactionsProps
  extends Omit<FetchApiDataProps, 'onApiData'> {
  hasMaxTransactionsSize?: boolean;
}

export const useFetchTransactions = (props: FetchTransactionsProps) => {
  const dispatch = useDispatch();
  const transactionFilters = useGetTransactionFilters();
  const { page, size } = useGetPage();

  const { hasMaxTransactionsSize, dataCountPromise, filters } = props;

  const { transactions, transactionsCount, isDataReady, isWebsocket } =
    useSelector(transactionsSelector);

  const maxTransactionsSize =
    hasMaxTransactionsSize && size > MAX_TRANSACTIONS_PAGE_SIZE
      ? MAX_TRANSACTIONS_PAGE_SIZE
      : size;

  const onWebsocketData = (event: TransactionType[]) => {
    if (!event) {
      return;
    }

    dispatch(
      setTransactions({
        transactions: event,
        transactionsCount: ELLIPSIS,
        isWebsocket: true,
        isDataReady: true
      })
    );
  };

  const onApiData = (response: any[]) => {
    const [transactionsData, transactionsCountData] = response;
    dispatch(
      setTransactions({
        transactions: transactionsData.data ?? [],
        transactionsCount: transactionsCountData?.data ?? ELLIPSIS,
        isWebsocket: false,
        isDataReady:
          transactionsData.success &&
          Boolean(!dataCountPromise || transactionsCountData?.success)
      })
    );
  };

  const { fetchData, dataChanged } = useFetchApiData({
    ...props,
    filters: {
      page,
      size: maxTransactionsSize,
      ...transactionFilters,
      ...filters
    },
    onWebsocketData,
    onApiData,
    isWebsocketUpdate: isWebsocket
  });

  return {
    transactions,
    totalTransactions: transactionsCount,
    isDataReady,
    fetchTransactions: fetchData,
    dataChanged
  };
};
