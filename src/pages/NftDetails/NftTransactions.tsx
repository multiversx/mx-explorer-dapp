import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchTransactions } from 'hooks';
import { NftTabs } from 'layouts/NftLayout/NftTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const NftTransactions = () => {
  const [searchParams] = useSearchParams();
  const { getNftTransfers, getNftTransfersCount } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { hash: identifier } = useParams();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions({
    transactionPromise: getNftTransfers,
    transactionCountPromise: getNftTransfersCount,
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
            title={<NftTabs />}
            dataChanged={dataChanged}
            isDataReady={isDataReady}
            inactiveFilters={[TransactionFiltersEnum.token]}
          />
        </div>
      </div>
    </div>
  );
};
