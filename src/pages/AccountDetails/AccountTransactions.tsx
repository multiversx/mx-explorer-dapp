import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchTransactions } from 'hooks';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';

export const AccountTransactions = () => {
  const [searchParams] = useSearchParams();
  const { getAccountTransfers, getAccountTransfersCount } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { account } = useSelector(accountSelector);
  const { address, txCount, balance } = account;

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions({
    dataPromise: getAccountTransfers,
    dataCountPromise: getAccountTransfersCount,
    filters: {
      address,
      withTxsRelayedByAddress: true
    }
  });

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, address, txCount, balance]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <div className='card p-0'>
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
  );
};
