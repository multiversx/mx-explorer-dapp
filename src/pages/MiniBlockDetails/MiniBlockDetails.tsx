import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable } from 'components';
import { FailedScResults } from 'components/ScResultsTable/FailedScResults';
import { FailedTransactions } from 'components/TransactionsTable/components/FailedTransactions';
import { useAdapter, useFetchTransactions } from 'hooks';
import { activeNetworkSelector, miniBlockSelector } from 'redux/selectors';
import { TransactionFiltersEnum } from 'types';

export const MiniBlockDetails = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { miniBlockHash, type } = useSelector(miniBlockSelector);

  const { getTransfers, getTransfersCount } = useAdapter();

  const {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  } = useFetchTransactions(getTransfers, getTransfersCount, {
    miniBlockHash
  });

  useEffect(() => {
    if (ref.current !== null) {
      fetchTransactions();
    }
  }, [activeNetworkId, miniBlockHash]);

  useEffect(() => {
    fetchTransactions(Boolean(searchParams.toString()));
  }, [searchParams]);

  const isScResult = type === 'SmartContractResultBlock';

  return (
    <>
      {isDataReady === undefined && <Loader />}
      {isDataReady === false && isScResult && <FailedScResults />}
      {isDataReady === false && !isScResult && <FailedTransactions />}

      <div ref={ref}>
        {isDataReady === true && (
          <div className='row'>
            <div className='col-12'>
              <TransactionsTable
                transactions={transactions}
                totalTransactions={totalTransactions}
                showDirectionCol={false}
                title={
                  <h5
                    data-testid='title'
                    className='table-title d-flex align-items-center'
                  >
                    {isScResult ? 'SC Results' : 'Transactions'}
                  </h5>
                }
                dataChanged={dataChanged}
                inactiveFilters={[TransactionFiltersEnum.miniBlockHash]}
                isScResultsTable={isScResult}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
