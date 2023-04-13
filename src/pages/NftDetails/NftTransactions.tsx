import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable } from 'components';
import { FailedTransactions } from 'components/TransactionsTable/components/FailedTransactions';
import { useAdapter, useFetchTransactions } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

import { NftTabs } from './NftLayout/NftTabs';

export const NftTransactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getNftTransactions, getNftTransactionsCount } = useAdapter();
  const { hash: identifier } = useParams();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions(getNftTransactions, getNftTransactionsCount, {
    identifier
  });

  useEffect(() => {
    if (ref.current !== null) {
      fetchTransactions();
    }
  }, [activeNetworkId, identifier]);

  React.useEffect(() => {
    if (searchParams.toString()) {
      fetchTransactions(Boolean(searchParams.toString()));
    }
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
                totalTransactions={totalTransactions}
                showDirectionCol={true}
                title={<NftTabs />}
                dataChanged={dataChanged}
                inactiveFilters={[TransactionFiltersEnum.token]}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
