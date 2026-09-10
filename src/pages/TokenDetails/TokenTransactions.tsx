import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchCustomTransfers } from 'hooks';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { activeNetworkSelector } from 'redux/selectors';
import {
  TransactionFiltersEnum,
  WebsocketEventsEnum,
  WebsocketSubcriptionsEnum
} from 'types';

export const TokenTransactions = () => {
  const [searchParams] = useSearchParams();
  const { getTokenTransfers, getTokenTransfersCount } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { hash: tokenIdentifier } = useParams();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchCustomTransfers({
    uuid: tokenIdentifier,
    dataPromise: getTokenTransfers,
    dataCountPromise: getTokenTransfersCount,
    subscription: WebsocketSubcriptionsEnum.subscribeCustomTransfers,
    event: WebsocketEventsEnum.customTransferUpdate,
    filters: {
      token: tokenIdentifier
    },
    websocketConfig: { token: tokenIdentifier }
  });

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, tokenIdentifier]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  return (
    <div className='card p-0'>
      <div className='row'>
        <div className='col-12'>
          <TransactionsTable
            transactions={transactions}
            token={tokenIdentifier}
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
