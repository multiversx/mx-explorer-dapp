import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, useAdapter } from 'components';

import { txStatus } from 'components/TransactionStatus/txStatus';
import { NoTransactions } from 'components/TransactionsTable/NoTransactions';
import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { useSize, useURLSearchParams } from 'helpers';
import {
  UITransactionType,
  TransactionsResponseType,
  TransactionsCountResponseType,
} from 'helpers/types';
import { AccountTabs } from './AccountLayout/AccountTabs';

export const AccountDetails = () => {
  const ref = React.useRef(null);
  const { getAccountTransfers, getAccountTransfersCount } = useAdapter();
  const { size, firstPageTicker } = useSize();
  const {
    senderShard,
    receiverShard,
    sender,
    receiver,
    method,
    before,
    after,
    status,
    miniBlockHash,
    search,
  } = useURLSearchParams();
  const { activeNetworkId, accountDetails } = useGlobalState();
  const { hash: address } = useParams() as any;

  const [transactions, setTransactions] = React.useState<UITransactionType[]>([]);
  const [accountTransactionsCount, setAccountTransactionsCount] = React.useState<number | '...'>(
    '...'
  );
  const [isDataReady, setIsDataReady] = React.useState<boolean | undefined>();
  const [hasPendingTransaction, setHasPendingTransaction] = React.useState(false);

  const handleTransactions = (
    transactionsData: TransactionsResponseType,
    countData: TransactionsCountResponseType
  ) => {
    const { data, success } = transactionsData;
    if (ref.current !== null) {
      if (success && data && countData.success) {
        const existingHashes = transactions.map((b) => b.txHash);
        const newTransactions = data.map((transaction: UITransactionType) => ({
          ...transaction,
          isNew: !existingHashes.includes(transaction.txHash),
        }));

        setTransactions(newTransactions);
        setAccountTransactionsCount(countData?.data ?? '...');
        const pending = data.some(
          (tx: UITransactionType) =>
            tx.status.toLowerCase() === txStatus.pending.toLowerCase() || tx.pendingResults
        );
        setHasPendingTransaction(pending);
        setIsDataReady(true);
      } else if (transactions.length === 0) {
        setIsDataReady(false);
      }
    }
  };

  const fetchTransactions = () => {
    Promise.all([
      getAccountTransfers({
        size,
        address,

        senderShard,
        receiverShard,
        sender,
        receiver,
        method,
        before,
        after,
        status,
        miniBlockHash,
        search,
        withUsername: true,
      }),
      getAccountTransfersCount({
        size,
        address,

        senderShard,
        receiverShard,
        sender,
        receiver,
        method,
        before,
        after,
        status,
        miniBlockHash,
        search,
      }),
    ]).then(([accountTransfersData, accountTransfersCountData]) => {
      handleTransactions(accountTransfersData, accountTransfersCountData);
    });
  };

  React.useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size, address]);

  React.useEffect(() => {
    if (!loading) {
      if (hasPendingTransaction) {
        fetchTransactions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker, accountDetails.txCount, accountDetails.balance]);

  const loading = isDataReady === undefined;
  const showTransactions = isDataReady === true && transactions.length > 0;

  return (
    <div ref={ref}>
      <div className="row">
        <div className="col-12">
          {showTransactions ? (
            <TransactionsTable
              transactions={transactions}
              address={address}
              totalTransactions={accountTransactionsCount}
              size={size}
              directionCol={true}
              title={<AccountTabs />}
            />
          ) : (
            <div className="card">
              <div className="card-header">
                <div className="card-header-item d-flex align-items-center">
                  <AccountTabs />
                </div>
              </div>
              {isDataReady === undefined && <Loader />}
              {isDataReady === false && <FailedTransactions />}
              {isDataReady === true && transactions.length === 0 && <NoTransactions />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
