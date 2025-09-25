import { useDispatch, useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useGetPage, useGetTransactionInPoolFilters } from 'hooks';
import { transactionsInPoolSelector } from 'redux/selectors';
import { setTransactionsInPool } from 'redux/slices';
import { TransactionInPoolType } from 'types';
import { FetchApiDataProps, useFetchApiData } from './useFetchApiData';

interface TransactionsInPoolWebsocketResponseType {
  pool: TransactionInPoolType[];
  poolCount: number;
}

export const useFetchTransactionsInPool = (
  props: Omit<FetchApiDataProps, 'onApiData'>
) => {
  const dispatch = useDispatch();
  const transactionFilters = useGetTransactionInPoolFilters();
  const { page, size } = useGetPage();

  const { dataCountPromise, filters } = props;

  const {
    transactionsInPool,
    transactionsInPoolCount,
    isDataReady,
    isWebsocket
  } = useSelector(transactionsInPoolSelector);

  const onWebsocketData = (event: TransactionsInPoolWebsocketResponseType) => {
    if (!event) {
      return;
    }

    const { pool, poolCount } = event;
    dispatch(
      setTransactionsInPool({
        transactionsInPool: pool,
        transactionsInPoolCount: poolCount,
        isWebsocket: true,
        isDataReady: true
      })
    );
  };

  const onApiData = (response: any[]) => {
    const [transactionsInPoolData, transactionsInPoolCountData] = response;
    dispatch(
      setTransactionsInPool({
        transactionsInPool: transactionsInPoolData.data ?? [],
        transactionsInPoolCount: transactionsInPoolCountData?.data ?? ELLIPSIS,
        isWebsocket: false,
        isDataReady:
          transactionsInPoolData.success &&
          Boolean(!dataCountPromise || transactionsInPoolCountData?.success)
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
    onWebsocketData,
    onApiData,
    isWebsocketUpdate: isWebsocket
  });

  return {
    transactionsInPool,
    totalTransactionsInPool: transactionsInPoolCount,
    isDataReady,
    fetchTransactionsInPool: fetchData,
    dataChanged
  };
};
