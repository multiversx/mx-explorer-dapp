import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

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

  const { hash: tokenId } = useParams();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchCustomTransfers({
    uuid: tokenId,
    dataPromise: getTokenTransfers,
    dataCountPromise: getTokenTransfersCount,
    subscription: WebsocketSubcriptionsEnum.subscribeCustomTransfers,
    event: WebsocketEventsEnum.customTransferUpdate,
    filters: {
      token: tokenId
    },
    websocketConfig: { token: tokenId }
  });

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, tokenId]);

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
