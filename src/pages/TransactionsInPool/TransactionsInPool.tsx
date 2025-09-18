import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsInPoolTable } from 'components/TransactionsInPoolTable';
import {
  useAdapter,
  useFetchTransactions,
  useGetPage,
  useGetTransactionInPoolFilters
} from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { TransactionInPoolTypeEnum, UITransactionInPoolType } from 'types';

export const TransactionsInPool = () => {
  const [searchParams] = useSearchParams();
  const { getTransactionsInPool, getTransactionsInPoolCount } = useAdapter();
  const { type = TransactionInPoolTypeEnum.Transaction, ...rest } =
    useGetTransactionInPoolFilters();

  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const {
    fetchTransactions,
    transactions: transactionsInPool,
    totalTransactions: totalTransactionsInPool,
    isDataReady,
    dataChanged
  } = useFetchTransactions({
    transactionPromise: getTransactionsInPool,
    transactionCountPromise: getTransactionsInPoolCount,
    filters: {
      ...rest,
      type
    }
  });

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, firstPageRefreshTrigger]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

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
