import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchTransactions } from 'hooks';
import { CollectionTabs } from 'layouts/CollectionLayout/CollectionTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const CollectionTransactions = () => {
  const [searchParams] = useSearchParams();
  const { getCollectionTransfers, getCollectionTransfersCount } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { hash: identifier } = useParams();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions({
    transactionPromise: getCollectionTransfers,
    transactionCountPromise: getCollectionTransfersCount,
    filters: {
      identifier
    }
  });

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, identifier]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <div className='card p-0'>
      <div className='row'>
        <div className='col-12'>
          <TransactionsTable
            transactions={transactions}
            totalTransactions={totalTransactions}
            title={<CollectionTabs />}
            dataChanged={dataChanged}
            isDataReady={isDataReady}
            inactiveFilters={[TransactionFiltersEnum.token]}
            token={identifier}
          />
        </div>
      </div>
    </div>
  );
};
