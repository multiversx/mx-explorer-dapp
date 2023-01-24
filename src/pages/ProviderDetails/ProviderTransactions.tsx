import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Loader, TransactionsTable, useAdapter } from 'components';

import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { NoTransactions } from 'components/TransactionsTable/NoTransactions';
import { txStatus } from 'components/TransactionStatus/txStatus';
import { useSize, useURLSearchParams } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';
import { UITransactionType } from 'types';
import { ProviderTabs } from './ProviderLayout/ProviderTabs';

export const ProviderTransactions = () => {
  const ref = React.useRef(null);
  const { getTransactions, getTransactionsCount } = useAdapter();
  const { size, firstPageTicker } = useSize();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { hash: address } = useParams() as any;
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
    search
  } = useURLSearchParams();

  const [transactions, setTransactions] = React.useState<UITransactionType[]>(
    []
  );
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [transactionsCount, setTransactionsCount] = React.useState(0);
  const [hasPendingTransaction, setHasPendingTransaction] =
    React.useState(false);

  const fetchTransactions = () => {
    getTransactions({
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
      withUsername: true
    }).then((transactionsData) => {
      const { data, success } = transactionsData;
      if (success) {
        const existingHashes = transactions.map((b) => b.txHash);
        const newTransactions = data.map((transaction: UITransactionType) => ({
          ...transaction,
          isNew: !existingHashes.includes(transaction.txHash)
        }));
        if (ref.current !== null) {
          setTransactions(newTransactions);
          const pending = data.some(
            (tx: UITransactionType) =>
              tx.status.toLowerCase() === txStatus.pending.toLowerCase() ||
              tx.pendingResults
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
    getTransactionsCount({
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
      search
    }).then(({ data: count, success }) => {
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
      <div className='row'>
        <div className='col-12'>
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
            <div className='card'>
              <div className='card-header'>
                <div className='card-header-item d-flex align-items-center'>
                  <ProviderTabs />
                </div>
              </div>
              {dataReady === undefined && <Loader />}
              {dataReady === false && <FailedTransactions />}
              {dataReady === true && transactions.length === 0 && (
                <NoTransactions />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
