import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, adapter } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import { useSize, urlBuilder, useURLSearchParams } from 'helpers';
import AccountTabs from './AccountLayout/AccountTabs';

interface TransactionsResponseType {
  data?: any;
  success: boolean;
}

const AccountDetails = () => {
  const ref = React.useRef(null);
  const {
    getAccountTransfers,
    getAccountTransfersCount,
    getTransactions,
    getTransactionsCount,
  } = adapter();
  const { size, firstPageTicker } = useSize();
  const { method, before, after, status } = useURLSearchParams();
  const { activeNetworkId, accountDetails } = useGlobalState();
  const { hash: address } = useParams() as any;

  // TEMP
  const useTransactionsEndpoint = false; // useIsMainnet();

  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [accountTransactionsCount, setAccountTransactionsCount] = React.useState(0);
  const [isDataReady, setIsDataReady] = React.useState<boolean | undefined>();
  const [hasPendingTransaction, setHasPendingTransaction] = React.useState(false);

  const handleTransactions = (
    transactionsData: TransactionsResponseType,
    countData: TransactionsResponseType
  ) => {
    const { data, success } = transactionsData;
    if (ref.current !== null) {
      if (success && countData.success) {
        const existingHashes = transactions.map((b) => b.txHash);
        const newTransactions = data.map((transaction: TransactionType) => ({
          ...transaction,
          isNew: !existingHashes.includes(transaction.txHash),
        }));

        setTransactions(newTransactions);
        setAccountTransactionsCount(countData.data);
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
    if (!useTransactionsEndpoint) {
      Promise.all([
        getAccountTransfers({
          size,
          address,
          method,
          before,
          after,
          status,
          withUsername: true,
        }),
        getAccountTransfersCount({
          size,
          address,
          method,
          before,
          after,
          status,
        }),
      ]).then(([accountTransfersData, accountTransfersCountData]) => {
        handleTransactions(accountTransfersData, accountTransfersCountData);
      });
    } else {
      Promise.all([
        getTransactions({
          size,
          address,
          method,
          withUsername: true,
        }),
        getTransactionsCount({
          size,
          address,
          method,
        }),
      ]).then(([accountTransactionsData, accountTransactionsCountData]) => {
        handleTransactions(accountTransactionsData, accountTransactionsCountData);
      });
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
  }, [firstPageTicker, accountDetails.txCount, accountDetails.scrCount, accountDetails.balance]);

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
              allowFilters={true}
              baseRoute={urlBuilder.accountDetails(address)}
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
