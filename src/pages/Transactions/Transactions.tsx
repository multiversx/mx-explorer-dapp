import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import {
  Loader,
  TransactionsTable,
  useAdapter,
  PulsatingLed
} from 'components';
import { shardSpanText } from 'components/ShardSpan';
import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { useSize, useURLSearchParams } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { UITransactionType } from 'types';

export const Transactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getTransactionsCount, getTransactions } = useAdapter();

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
  const { size, firstPageTicker } = useSize();

  const [transactions, setTransactions] = useState<UITransactionType[]>([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalTransactions, setTotalTransactions] = useState<number | '...'>(
    '...'
  );

  const fetchTransactions = () => {
    if (searchParams.toString()) {
      setDataChanged(true);
    }
    Promise.all([
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
        withUsername: true
      }),
      getTransactionsCount({
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
      })
    ])
      .then(([transctionsData, transctionsCountData]) => {
        if (ref.current !== null) {
          if (transctionsData.success && transctionsCountData.success) {
            const existingHashes = transactions.map((b) => b.txHash);
            const newTransactions = transctionsData.data.map(
              (transaction: UITransactionType) => ({
                ...transaction,
                isNew: !existingHashes.includes(transaction.txHash)
              })
            );
            setTransactions(newTransactions);
            setTotalTransactions(Math.min(transctionsCountData.data, 10000));
          }
          setIsDataReady(
            transctionsData.success && transctionsCountData.success
          );
        }
      })
      .finally(() => {
        setDataChanged(false);
      });
  };

  React.useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetworkId, firstPageTicker, searchParams]);

  useEffect(() => {
    if (senderShard !== undefined || receiverShard !== undefined) {
      document.title = document.title.replace('Transactions', 'Shard Details');
    }
  }, [receiverShard, senderShard]);

  return (
    <>
      {isDataReady === undefined && <Loader />}
      {isDataReady === false && <FailedTransactions />}

      <div ref={ref}>
        {isDataReady === true && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <TransactionsTable
                  transactions={transactions}
                  totalTransactions={totalTransactions}
                  size={size}
                  dataChanged={dataChanged}
                  title={
                    <h5
                      data-testid='title'
                      className='table-title d-flex align-items-center'
                    >
                      Live Transactions
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
                      <PulsatingLed className='ms-2 mt-1' />
                    </h5>
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
