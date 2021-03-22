import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, adapter } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import { useSize } from 'helpers';
import ProviderTabs from './ProviderLayout/ProviderTabs';

const AccountDetails = () => {
  const ref = React.useRef(null);
  const { getTransactions, getTransactionsCount } = adapter();
  const { size, firstPageTicker } = useSize();
  const { activeNetworkId } = useGlobalState();
  const { hash: address } = useParams() as any;

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [transactionsCount, setTransactionsCount] = React.useState(0);
  const [hasPendingTransaction, setHasPendingTransaction] = React.useState(false);

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
          setDataReady(true);
        }
      } else if (transactions.length === 0) {
        if (ref.current !== null) {
          setDataReady(false);
        }
      }
    });
  };

  const fetchTransactionsCount = () => {
    getTransactionsCount({ address }).then(({ data: count, success }) => {
      if (ref.current !== null && success) {
        setTransactionsCount(count);
      }
    });
  };

  React.useEffect(() => {
    fetchTransactions();
    fetchTransactionsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size, address]);

  React.useEffect(() => {
    if (!loading) {
      if (hasPendingTransaction) {
        fetchTransactions();
      }
      fetchTransactionsCount();
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
              address={address}
              totalTransactions={transactionsCount}
              size={size}
              directionCol={true}
              title={<ProviderTabs />}
            />
          ) : (
            <div className="card">
              <div className="card-header">
                <div className="card-header-item d-flex align-items-center">
                  <ProviderTabs />
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

export default AccountDetails;
