import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, adapter } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import { useSize, useIsMainnet } from 'helpers';
import AccountTabs from './AccountLayout/AccountTabs';

interface TransactionsResponseType {
  data?: any;
  success: boolean;
}

const AccountDetails = () => {
  const ref = React.useRef(null);
  const { getAccountTransfers, getTransactions } = adapter();
  const { size, firstPageTicker } = useSize();
  const { activeNetworkId, accountDetails } = useGlobalState();
  const { hash: address } = useParams() as any;

  // TEMP
  const isMainnet = useIsMainnet();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [isDataReady, setIsDataReady] = React.useState<boolean | undefined>();
  const [hasPendingTransaction, setHasPendingTransaction] = React.useState(false);

  const handleTransactions = (transactionsData: TransactionsResponseType) => {
    const { data, success } = transactionsData;
    if (ref.current !== null) {
      if (success) {
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
        setIsDataReady(true);
      } else if (transactions.length === 0) {
        setIsDataReady(false);
      }
    }
  };

  const fetchTransactions = () => {
    if (!isMainnet) {
      getAccountTransfers({
        size,
        address,
      }).then((transactionsData) => handleTransactions(transactionsData));
    } else {
      getTransactions({
        size,
        address,
        withScResults: true,
        withOperations: true,
      }).then((transactionsData) => handleTransactions(transactionsData));
    }
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
  }, [firstPageTicker]);

  React.useEffect(() => {
    if (!loading) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, accountDetails.scrCount, accountDetails.balance]);

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
              totalTransactions={
                !isMainnet
                  ? accountDetails.txCount + accountDetails.scrCount
                  : accountDetails.txCount
              }
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

export default AccountDetails;
