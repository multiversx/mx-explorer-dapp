import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable } from 'components';
import { FailedTransactions } from 'components/TransactionsTable/components/FailedTransactions';
import { useAdapter, useFetchTransactions } from 'hooks';
import { ProviderTabs } from 'layouts/ProviderLayout/ProviderTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const ProviderTransactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getTransactions, getTransactionsCount } = useAdapter();

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
  } = useFetchTransactions(getTransactions, getTransactionsCount, {
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
    <>
      {isDataReady === undefined && <Loader />}
      {isDataReady === false && <FailedTransactions />}

      <div ref={ref}>
        {isDataReady === true && (
          <div className='row'>
            <div className='col-12'>
              <TransactionsTable
                transactions={transactions}
                address={address}
                totalTransactions={totalTransactions}
                showDirectionCol={false}
                title={<ProviderTabs />}
                inactiveFilters={inactiveFilters}
                dataChanged={dataChanged}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
