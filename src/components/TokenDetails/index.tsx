import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, adapter } from 'sharedComponents';

import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import { useSize, useURLSearchParams } from 'helpers';
import {
  UITransactionType,
  TransactionsResponseType,
  TransactionsCountResponseType,
} from 'helpers/types';
import TokenTabs from './TokenLayout/TokenTabs';

const TokenDetails = () => {
  const ref = React.useRef(null);
  const { getTokenTransfers, getTokenTransfersCount } = adapter();
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
  const { activeNetworkId, tokenDetails } = useGlobalState();
  const { hash: tokenId } = useParams() as any;

  const { transactions: transactionsCount } = tokenDetails;

  const [transactions, setTransactions] = React.useState<UITransactionType[]>([]);
  const [tokenTransactionsCount, setTokenTransactionsCount] = React.useState<number | '...'>('...');
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
        setTokenTransactionsCount(countData?.data ?? '...');
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
      getTokenTransfers({
        size,
        tokenId,

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
      getTokenTransfersCount({
        size,
        tokenId,

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
    ]).then(([tokenTransfersData, tokenTransfersCountData]) => {
      handleTransactions(tokenTransfersData, tokenTransfersCountData);
    });
  };

  React.useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size, tokenId]);

  React.useEffect(() => {
    if (!loading) {
      if (hasPendingTransaction) {
        fetchTransactions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker]);

  React.useEffect(() => {
    if (!loading) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionsCount, transactionsCount]);

  const loading = isDataReady === undefined;
  const showTransactions = isDataReady === true && transactions.length > 0;

  return (
    <div ref={ref}>
      <div className="row">
        <div className="col-12">
          {showTransactions ? (
            <TransactionsTable
              transactions={transactions}
              totalTransactions={tokenTransactionsCount}
              size={size}
              directionCol={true}
              title={<TokenTabs />}
            />
          ) : (
            <div className="card">
              <div className="card-header">
                <div className="card-header-item d-flex align-items-center">
                  <TokenTabs />
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

export default TokenDetails;
