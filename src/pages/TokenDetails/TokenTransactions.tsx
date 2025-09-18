import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchTransactions } from 'hooks';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const TokenTransactions = () => {
  const [searchParams] = useSearchParams();
  const { getTokenTransfers, getTokenTransfersCount } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { transactions: transactionsCount } = token;

  const { hash: tokenId } = useParams();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions({
    transactionPromise: getTokenTransfers,
    transactionCountPromise: getTokenTransfersCount,
    filters: {
      tokenId
    }
  });

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, tokenId, transactionsCount]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <div className='card p-0'>
      <div className='row'>
        <div className='col-12'>
          <TransactionsTable
            transactions={transactions}
            token={tokenId}
            totalTransactions={totalTransactions}
            title={<TokenTabs />}
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
