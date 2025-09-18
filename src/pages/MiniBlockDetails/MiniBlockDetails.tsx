import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchTransactions } from 'hooks';
import { activeNetworkSelector, miniBlockSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const MiniBlockDetails = () => {
  const [searchParams] = useSearchParams();
  const { getTransfers, getTransfersCount } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { miniBlockHash, type } = useSelector(miniBlockSelector);

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions({
    transactionPromise: getTransfers,
    transactionCountPromise: getTransfersCount,
    filters: {
      miniBlockHash
    }
  });

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, miniBlockHash]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  const isScResult = type === 'SmartContractResultBlock';

  return (
    <div className='card p-0'>
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
