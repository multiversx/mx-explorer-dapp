import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable } from 'components';
import { FailedTransactions } from 'components/TransactionsTable/components/FailedTransactions';
import { useAdapter, useFetchTransactions } from 'hooks';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';

import { AccountTabs } from './AccountLayout/AccountTabs';

export const AccountDetails = () => {
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
                showDirectionCol={true}
                title={<AccountTabs />}
                dataChanged={dataChanged}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
