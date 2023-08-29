import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsTable, PulsatingLed } from 'components';
import { shardSpanText } from 'components/ShardSpan';
import { MethodList } from 'components/TransactionsTable/components/TransactionsFilters';
import {
  useAdapter,
  useGetPage,
  useGetTransactionFilters,
  useFetchTransactions
} from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';

export const Transactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const urlParams = useGetTransactionFilters();
  const { senderShard, receiverShard } = urlParams;

  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getTransactions, getTransactionsCount } = useAdapter();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions(getTransactions, getTransactionsCount);

  useEffect(() => {
    if (ref.current !== null) {
      fetchTransactions();
    }
  }, [activeNetworkId, firstPageRefreshTrigger]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  useEffect(() => {
    if (senderShard !== undefined || receiverShard !== undefined) {
      document.title = document.title.replace('Transactions', 'Shard Details');
    }
  }, [receiverShard, senderShard]);

  return (
    <div ref={ref} className='container page-content'>
      <div className='card p-0'>
        <div className='row'>
          <div className='col-12'>
            <TransactionsTable
              transactions={transactions}
              totalTransactions={totalTransactions}
              dataChanged={dataChanged}
              isDataReady={isDataReady}
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
    </div>
  );
};
