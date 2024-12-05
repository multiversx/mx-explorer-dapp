import { useEffect, useRef } from 'react';
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
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { type = TransactionInPoolTypeEnum.Transaction, ...rest } =
    useGetTransactionInPoolFilters();

  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getTransactionsInPool, getTransactionsInPoolCount } = useAdapter();

  const {
    fetchTransactions,
    transactions: transactionsInPool,
    totalTransactions: totalTransactionsInPool,
    isDataReady,
    dataChanged
  } = useFetchTransactions(getTransactionsInPool, getTransactionsInPoolCount, {
    ...rest,
    type
  });

  useEffect(() => {
    if (ref.current !== null) {
      fetchTransactions();
    }
  }, [activeNetworkId, firstPageRefreshTrigger]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <div ref={ref} className='container page-content'>
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
