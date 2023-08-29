import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchTransactions } from 'hooks';
import { ProviderTabs } from 'layouts/ProviderLayout/ProviderTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const ProviderTransactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getAccountTransfers, getAccountTransfersCount } = useAdapter();

  const { hash: address } = useParams();

  const inactiveFilters = [
    TransactionFiltersEnum.sender,
    TransactionFiltersEnum.receiver
  ];

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions(getAccountTransfers, getAccountTransfersCount, {
    address
  });

  useEffect(() => {
    if (ref.current !== null) {
      fetchTransactions();
    }
  }, [activeNetworkId, address]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <div ref={ref} className='card p-0'>
      <div className='row'>
        <div className='col-12'>
          <TransactionsTable
            transactions={transactions}
            address={address}
            totalTransactions={totalTransactions}
            title={<ProviderTabs />}
            inactiveFilters={inactiveFilters}
            dataChanged={dataChanged}
            isDataReady={isDataReady}
          />
        </div>
      </div>
    </div>
  );
};
