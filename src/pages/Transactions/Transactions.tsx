import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { TransactionsTable, PulsatingLed } from 'components';
import { MethodList } from 'components/TransactionsTable/components';
import {
  useAdapter,
  useGetPage,
  useGetTransactionFilters,
  useFetchTransactions,
  useGetShardText
} from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';

export const Transactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const getShardText = useGetShardText();
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
              inactiveFilters={[]}
              dataChanged={dataChanged}
              isDataReady={isDataReady}
              title={
                <h5
                  data-testid='title'
                  className='table-title d-flex align-items-center flex-wrap'
                >
                  <div className='d-flex align-items-center flex-wrap'></div>
                  Live Transactions
                  {senderShard !== undefined && (
                    <>
                      <span>&nbsp;from&nbsp;</span>
                      {getShardText(senderShard)}
                    </>
                  )}
                  {receiverShard !== undefined && (
                    <>
                      <span>&nbsp;to&nbsp;</span>
                      {getShardText(receiverShard)}
                    </>
                  )}
                  <PulsatingLed className='mx-2 mt-1' />
                  <div className='d-flex align-items-center flex-wrap gap-2'>
                    {/* <NetworkLink
                      to={transactionsRoutes.transactionsInPool}
                      className='btn btn-sm btn-dark-gradient'
                    >
                      Transaction Pool
                    </NetworkLink> */}
                    <MethodList />
                  </div>
                </h5>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
