import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchTransactions } from 'hooks';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';

export const AccountTransactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { account } = useSelector(accountSelector);
  const { address, txCount, balance } = account;

  const { getAccountTransfers, getAccountTransfersCount } = useAdapter();

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
  }, [activeNetworkId, address, txCount, balance]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <>
      <div ref={ref} className='card p-0'>
        <div className='row'>
          <div className='col-12'>
            <TransactionsTable
              transactions={transactions}
              address={address}
              totalTransactions={totalTransactions}
              showDirectionCol={true}
              title={<AccountTabs />}
              dataChanged={dataChanged}
              isDataReady={isDataReady}
            />
          </div>
        </div>
      </div>
    </>
  );
};
