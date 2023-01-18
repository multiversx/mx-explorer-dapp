import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, adapter } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import { useSize, useURLSearchParams } from 'helpers';
import TokenTabs from './TokenLayout/TokenTabs';

interface TransactionsResponseType {
  data?: TransactionType[];
  success: boolean;
}

const TokenDetails = () => {
  const ref = React.useRef(null);
  const { getTokenTransactions, getTokenTransfers } = adapter();
  const { size, firstPageTicker } = useSize();
  const { activeNetworkId, tokenDetails } = useGlobalState();
  const { hash: tokenId } = useParams() as any;
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

  // TEMP
  const useTransactionsEndpoint = false; // useIsMainnet();

  const { transactions: transactionsCount } = tokenDetails;

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [hasPendingTransaction, setHasPendingTransaction] = React.useState(false);

  const handleTransactions = (transactionsData: TransactionsResponseType) => {
    const { data, success } = transactionsData;
    if (ref.current !== null) {
      if (success && data) {
        const existingHashes = transactions.map((b) => b.txHash);
        const newTransactions = data.map((transaction: TransactionType) => ({
          ...transaction,
          isNew: !existingHashes.includes(transaction.txHash),
        }));

        setTransactions(newTransactions);
        const pending = data.some(
          (tx: TransactionType) =>
            tx.status.toLowerCase() === txStatus.pending.toLowerCase() || tx.pendingResults
        );
        setHasPendingTransaction(pending);
        setDataReady(true);
      } else if (transactions.length === 0) {
        setDataReady(false);
      }
    }
  };

  const fetchTransactions = () => {
    if (!useTransactionsEndpoint) {
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
      }).then((transactionsData) => handleTransactions(transactionsData));
    } else {
      getTokenTransactions({
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
      }).then((transactionsData) => handleTransactions(transactionsData));
    }
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
  }, [transactionsCount]);

  const loading = dataReady === undefined;
  const showTransactions = dataReady === true && transactions.length > 0;

  return (
    <div ref={ref}>
      <div className="row">
        <div className="col-12">
          {showTransactions ? (
            <TransactionsTable
              transactions={transactions}
              totalTransactions={transactionsCount}
              size={size}
              directionCol={true}
              title={<TokenTabs />}
              showLockedAccounts={true}
              allowFilters={true}
            />
          ) : (
            <div className="card">
              <div className="card-header">
                <div className="card-header-item d-flex align-items-center">
                  <TokenTabs />
                </div>
              </div>
              {dataReady === undefined && <Loader />}
              {dataReady === false && <FailedTransactions />}
              {dataReady === true && transactions.length === 0 && <NoTransactions />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
