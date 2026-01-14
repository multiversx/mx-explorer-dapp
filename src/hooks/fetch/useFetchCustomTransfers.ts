import { useDispatch, useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useGetPage, useGetTransactionFilters } from 'hooks';
import { customTransfersSelector } from 'redux/selectors';
import { setCustomTransfers } from 'redux/slices';
import { TransactionType } from 'types';
import { FetchApiDataProps, useFetchApiData } from './useFetchApiData';

export interface FetchCustomTransfersProps
  extends Omit<FetchApiDataProps, 'onApiData'> {
  uuid?: string;
}

export interface CustomTransfersWebsocketResponseType {
  transfers: TransactionType[];
  timestampMs: number;
}

export const useFetchCustomTransfers = (props: FetchCustomTransfersProps) => {
  const dispatch = useDispatch();
  const transactionFilters = useGetTransactionFilters();
  const { page, size } = useGetPage();

  const { dataCountPromise, filters, websocketConfig } = props;

  const { transactions, transactionsCount, isDataReady, isRefreshPaused } =
    useSelector(customTransfersSelector);

  const onWebsocketData = (event: CustomTransfersWebsocketResponseType) => {
    if (!event) {
      return;
    }

    console.log('-------event', event);

    const { transfers } = event;
    dispatch(
      setCustomTransfers({
        transactions: transfers,
        transactionsCount: ELLIPSIS,
        size,
        isWebsocket: false, // keep api, only latest updates fetched fron ws
        isDataReady: true
      })
    );
  };

  const onApiData = (response: any[]) => {
    const [transactionsData, transactionsCountData] = response;
    dispatch(
      setCustomTransfers({
        transactions: transactionsData.data ?? [],
        transactionsCount: transactionsCountData?.data ?? ELLIPSIS,
        isWebsocket: false,
        size,
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
      size,
      ...transactionFilters,
      ...filters
    },
    websocketConfig,
    onWebsocketData,
    onApiData,
    urlParams: transactionFilters,
    isRefreshPaused,
    isCustomUpdate: true
  });

  return {
    transactions,
    totalTransactions: transactionsCount,
    isDataReady,
    fetchTransactions: fetchData,
    dataChanged
  };
};
