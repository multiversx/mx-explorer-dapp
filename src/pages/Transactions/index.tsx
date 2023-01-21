import * as React from 'react';
import { useGlobalState } from 'context';
import { Loader, TransactionsTable, useAdapter } from 'components';

import { NoTransactions } from 'components/TransactionsTable/NoTransactions';
import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { useSize, useURLSearchParams } from 'helpers';
import { UITransactionType } from 'helpers/types';
import { shardSpanText } from 'components/ShardSpan';

export const Transactions = () => {
  const ref = React.useRef(null);
  const { activeNetworkId } = useGlobalState();

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
  const { size, firstPageTicker } = useSize();

  React.useEffect(() => {
    if (senderShard !== undefined || receiverShard !== undefined) {
      document.title = document.title.replace('Transactions', 'Shard Details');
    }
  }, [receiverShard, senderShard]);

  const { getTransactionsCount, getTransactions } = useAdapter();

  const [transactions, setTransactions] = React.useState<UITransactionType[]>([]);
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [totalTransactions, setTotalTransactions] = React.useState<number | '...'>('...');

  React.useEffect(() => {
    getTransactions({
      size,
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
    }).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          const existingHashes = transactions.map((b) => b.txHash);
          const newTransactions = data.map((transaction: UITransactionType) => ({
            ...transaction,
            isNew: !existingHashes.includes(transaction.txHash),
          }));
          setTransactions(newTransactions);
        }
        setDataReady(success);
      }
    });
    getTransactionsCount({
      senderShard,
      receiverShard,
      method,
      before,
      after,
      status,
    }).then(({ data: count, success }) => {
      if (ref.current !== null && success) {
        setTotalTransactions(Math.min(count, 10000));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, size, firstPageTicker]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedTransactions />}

      <div ref={ref}>
        {dataReady === true && (
          <div className="container page-content">
            <div className="row">
              <div className="col-12">
                {transactions.length > 0 ? (
                  <TransactionsTable
                    transactions={transactions}
                    totalTransactions={totalTransactions}
                    size={size}
                    title={
                      <h6 data-testid="title">
                        Transactions
                        {senderShard !== undefined && (
                          <>
                            <span>&nbsp;from&nbsp;</span>
                            {shardSpanText(senderShard)}
                          </>
                        )}
                        {receiverShard !== undefined && (
                          <>
                            <span>&nbsp;to&nbsp;</span>
                            {shardSpanText(receiverShard)}
                          </>
                        )}
                      </h6>
                    }
                  />
                ) : (
                  <div className="card">
                    <NoTransactions />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
