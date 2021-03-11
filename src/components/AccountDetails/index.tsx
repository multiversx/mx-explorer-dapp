import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, adapter } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import { useSize } from 'helpers';
import AccountTabs from './AccountTabs';

const AccountDetails = () => {
  const ref = React.useRef(null);
  const { getTransactions } = adapter();
  const { size, firstPageTicker } = useSize();
  const { activeNetworkId, accountDetails } = useGlobalState();
  const { hash: address } = useParams() as any;

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();
  const [hasPendingTransaction, setHasPendingTransaction] = React.useState(false);

  const totalTransactions =
    accountDetails && accountDetails.txCount ? accountDetails.txCount : '...';

  const fetchTransactions = () => {
    getTransactions({
      size,
      address,
    }).then((transactionsData) => {
      const { data, success } = transactionsData;
      if (success) {
        const existingHashes = transactions.map((b) => b.txHash);
        const newTransactions = data.map((transaction: TransactionType) => ({
          ...transaction,
          isNew: !existingHashes.includes(transaction.txHash),
        }));
        if (ref.current !== null) {
          setTransactions(newTransactions);
          const pending = data.some(
            (tx: TransactionType) => tx.status.toLowerCase() === txStatus.pending.toLowerCase()
          );
          setHasPendingTransaction(pending);
          setTransactionsFetched(true);
        }
      } else if (transactions.length === 0) {
        if (ref.current !== null) {
          setTransactionsFetched(false);
        }
      }
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
  }, [firstPageTicker]);

  React.useEffect(() => {
    if (!loading) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails?.txCount, accountDetails?.balance]);

  const loading = transactionsFetched === undefined;
  const showTransactions = transactionsFetched === true && transactions.length > 0;

  return (
    <div ref={ref}>
      <div className="row">
        <div className="col-12">
          {showTransactions ? (
            <TransactionsTable
              transactions={transactions}
              address={address}
              totalTransactions={totalTransactions}
              size={size}
              directionCol={true}
              title={<AccountTabs />}
            />
          ) : (
            <div className="card">
              {transactionsFetched === undefined && <Loader />}
              {transactionsFetched === false && <FailedTransactions />}
              {transactionsFetched === true && transactions.length === 0 && <NoTransactions />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
