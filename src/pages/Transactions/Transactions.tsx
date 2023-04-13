import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable, PulsatingLed } from 'components';
import { shardSpanText } from 'components/ShardSpan';
import { FailedTransactions } from 'components/TransactionsTable/components/FailedTransactions';
import { MethodList } from 'components/TransactionsTable/components/TransactionsFilters';
import {
  useAdapter,
  useSize,
  useURLSearchParams,
  useFetchTransactions
} from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';

export const Transactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const urlParams = useURLSearchParams();
  const { senderShard, receiverShard } = urlParams;

  const { firstPageTicker } = useSize();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getTransactions, getTransactionsCount } = useAdapter();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions(getTransactions, getTransactionsCount);

  React.useEffect(() => {
    if (ref.current !== null) {
      fetchTransactions(Boolean(searchParams.toString()));
    }
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
                  dataChanged={dataChanged}
                  title={
                    <h5
                      data-testid='title'
                      className='table-title d-flex align-items-center flex-wrap'
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
                      <MethodList />
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
