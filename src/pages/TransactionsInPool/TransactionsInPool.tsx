import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import { TransactionsInPoolTable } from 'components/TransactionsInPoolTable';
import { useAdapter, useGetPage, useGetTransactionInPoolFilters } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { TransactionInPoolType } from 'types';

export const TransactionsInPool = () => {
  const [searchParams] = useSearchParams();

  const { page, size } = useGetPage();

  const urlParams = useGetTransactionInPoolFilters();
  const { sender, receiver, type } = urlParams;

  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [transactionsInPool, setTransactionsInPool] = useState<
    TransactionInPoolType[]
  >([]);
  const [totalTransactionsInPool, setTotalTransactionsInPool] = useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);

  const { getTransactionsInPool, getTransactionsInPoolCount } = useAdapter();

  const fetchTransactionsInPool = (paramsChange = false) => {
    if (searchParams.toString() && paramsChange) {
      setDataChanged(true);
    }
    Promise.all([
      getTransactionsInPool({
        page,
        size,
        sender,
        receiver,
        type
      }),
      getTransactionsInPoolCount({ sender, receiver, type })
    ])
      .then(([transactionsInPoolData, transactionsInPoolCountData]) => {
        if (
          transactionsInPoolData.success &&
          transactionsInPoolCountData.success
        ) {
          setTransactionsInPool(transactionsInPoolData.data);
          setTotalTransactionsInPool(transactionsInPoolCountData.data);
        }
        setIsDataReady(
          transactionsInPoolData.success && transactionsInPoolCountData.success
        );
      })
      .finally(() => {
        setDataChanged(false);
      });
  };

  useEffect(() => {
    fetchTransactionsInPool();
  }, [activeNetworkId, firstPageRefreshTrigger]);

  useEffect(() => {
    fetchTransactionsInPool(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <div className='container page-content'>
      <div className='card p-0'>
        <div className='row'>
          <div className='col-12'>
            <TransactionsInPoolTable
              transactionsInPool={transactionsInPool}
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
