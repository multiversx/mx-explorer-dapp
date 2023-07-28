import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchTransactions } from 'hooks';
import { activeNetworkSelector, miniBlockSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const MiniBlockDetails = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { miniBlockHash, type } = useSelector(miniBlockSelector);

  const { getTransfers, getTransfersCount } = useAdapter();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions(getTransfers, getTransfersCount, {
    miniBlockHash
  });

  useEffect(() => {
    if (ref.current !== null) {
      fetchTransactions();
    }
  }, [activeNetworkId, miniBlockHash]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  const isScResult = type === 'SmartContractResultBlock';

  return (
    <div ref={ref} className='card p-0'>
      <div className='row'>
        <div className='col-12'>
          <TransactionsTable
            transactions={transactions}
            totalTransactions={totalTransactions}
            title={
              <h5
                data-testid='title'
                className='table-title d-flex align-items-center'
              >
                {isScResult ? 'SC Results' : 'Transactions'}
              </h5>
            }
            dataChanged={dataChanged}
            isDataReady={isDataReady}
            inactiveFilters={[TransactionFiltersEnum.miniBlockHash]}
            isScResultsTable={isScResult}
          />
        </div>
      </div>
    </div>
  );
};
