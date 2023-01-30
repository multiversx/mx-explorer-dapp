import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable, useAdapter } from 'components';
import { FailedScResults } from 'components/ScResultsTable/FailedScResults';
import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { useSize, useURLSearchParams } from 'hooks';
import { activeNetworkSelector, miniBlockSelector } from 'redux/selectors';
import { UITransactionType, TxFiltersEnum } from 'types';

export const MiniBlockDetails = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { miniBlockHash, type } = useSelector(miniBlockSelector);

  const { getTransfers, getTransfersCount } = useAdapter();

  const {
    senderShard,
    receiverShard,
    sender,
    receiver,
    method,
    before,
    after,
    status,
    search
  } = useURLSearchParams();
  const { size } = useSize();

  const [transactions, setTransactions] = useState<UITransactionType[]>([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalTransactions, setTotalTransactions] = useState<number | '...'>(
    '...'
  );

  const fetchTransactions = (paramsChange = false) => {
    if (miniBlockHash) {
      if (searchParams.toString() && paramsChange) {
        setDataChanged(true);
      }
      Promise.all([
        getTransfers({
          size,
          miniBlockHash,

          senderShard,
          receiverShard,
          sender,
          receiver,
          method,
          before,
          after,
          status,
          search,
          withUsername: true
        }),
        getTransfersCount({
          size,
          miniBlockHash,

          senderShard,
          receiverShard,
          sender,
          receiver,
          method,
          before,
          after,
          status,
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
          if (paramsChange) {
            setDataChanged(false);
          }
        });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, miniBlockHash]);

  React.useEffect(() => {
    fetchTransactions(true);
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
                size={size}
                directionCol={true}
                title={
                  <h5
                    data-testid='title'
                    className='table-title d-flex align-items-center'
                  >
                    {isScResult ? 'SC Results' : 'Transactions'}
                  </h5>
                }
                dataChanged={dataChanged}
                inactiveFilters={[TxFiltersEnum.miniBlockHash]}
                isScResultsTable={isScResult}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
