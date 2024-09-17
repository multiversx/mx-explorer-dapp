import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchTransactions } from 'hooks';
import { NativeTokenTabs } from 'layouts/NativeTokenLayout/NativeTokenTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const NativeTokenTransactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId, egldLabel } = useSelector(activeNetworkSelector);
  const { getTransfers, getTransfersCount } = useAdapter();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions(getTransfers, getTransfersCount, {
    token: egldLabel
  });

  useEffect(() => {
    if (ref.current !== null) {
      fetchTransactions();
    }
  }, [activeNetworkId]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <div ref={ref} className='card p-0'>
      <div className='row'>
        <div className='col-12'>
          <TransactionsTable
            transactions={transactions}
            token={egldLabel}
            totalTransactions={totalTransactions}
            title={<NativeTokenTabs />}
            dataChanged={dataChanged}
            isDataReady={isDataReady}
            inactiveFilters={[TransactionFiltersEnum.token]}
            showLockedAccounts
          />
        </div>
      </div>
    </div>
  );
};
