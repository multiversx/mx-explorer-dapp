import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsInPoolTable } from 'components/TransactionsInPoolTable';
import {
  useAdapter,
  useFetchTransactionsInPool,
  useGetPage,
  useGetTransactionInPoolFilters
} from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import {
  TransactionInPoolTypeEnum,
  UITransactionInPoolType,
  WebsocketEventsEnum,
  WebsocketSubcriptionsEnum
} from 'types';

export const TransactionsInPool = () => {
  const [searchParams] = useSearchParams();
  const { getTransactionsInPool, getTransactionsInPoolCount } = useAdapter();
  const { type = TransactionInPoolTypeEnum.Transaction, ...rest } =
    useGetTransactionInPoolFilters();

  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const {
    fetchTransactionsInPool,
    transactionsInPool,
    totalTransactionsInPool,
    isDataReady,
    dataChanged
  } = useFetchTransactionsInPool({
    dataPromise: getTransactionsInPool,
    dataCountPromise: getTransactionsInPoolCount,
    filters: { ...rest, type },
    config: { type },
    subscription: WebsocketSubcriptionsEnum.subscribePool,
    event: WebsocketEventsEnum.transactionUpdate
  });

  useEffect(() => {
    fetchTransactionsInPool(Boolean(searchParams.toString()));
  }, [searchParams, activeNetworkId, firstPageRefreshTrigger]);

  return (
    <div className='container page-content'>
      <div className='card p-0'>
        <div className='row'>
          <div className='col-12'>
            <TransactionsInPoolTable
              transactionsInPool={
                transactionsInPool as unknown as UITransactionInPoolType[]
              }
              totalTransactionsInPool={totalTransactionsInPool}
              dataChanged={dataChanged}
              isDataReady={isDataReady}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
