import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsTable } from 'components';
import { useAdapter, useFetchCustomTransfers } from 'hooks';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';

export const AccountTransactions = () => {
  const [searchParams] = useSearchParams();
  const { getAccountTransfers, getAccountTransfersCount } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { account } = useSelector(accountSelector);
  const { address } = account;

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchCustomTransfers({
    uuid: address,
    dataPromise: getAccountTransfers,
    dataCountPromise: getAccountTransfersCount,
    subscription: WebsocketSubcriptionsEnum.subscribeCustomTransfers,
    event: WebsocketEventsEnum.customTransferUpdate,
    filters: {
      address
    },
    websocketConfig: { address }
  });

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, address]);

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
