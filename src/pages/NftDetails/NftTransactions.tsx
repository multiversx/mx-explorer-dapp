import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable } from 'components';
import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { useAdapter, useSize, useURLSearchParams } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { UITransactionType, TransactionFiltersEnum } from 'types';

import { NftTabs } from './NftLayout/NftTabs';

export const NftTransactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getNftTransactions, getNftTransactionsCount } = useAdapter();

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
  const { size } = useSize();
  const { hash: identifier } = useParams();

  const [transactions, setTransactions] = useState<UITransactionType[]>([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalTransactions, setTotalTransactions] = useState<number | '...'>(
    '...'
  );

  const fetchTransactions = (paramsChange = false) => {
    if (identifier) {
      if (searchParams.toString() && paramsChange) {
        setDataChanged(true);
      }
      Promise.all([
        getNftTransactions({
          size,
          identifier,

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
        getNftTransactionsCount({
          size,
          identifier,

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
          if (paramsChange) {
            setDataChanged(false);
          }
        });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, identifier]);

  React.useEffect(() => {
    fetchTransactions(true);
  }, [searchParams]);

  return (
    <>
      {isDataReady === undefined && <Loader />}
      {isDataReady === false && <FailedTransactions />}

      <div ref={ref}>
        {isDataReady === true && (
          <div className='row'>
            <div className='col-12'>
              <TransactionsTable
                transactions={transactions}
                totalTransactions={totalTransactions}
                size={size}
                showDirectionCol={true}
                title={<NftTabs />}
                dataChanged={dataChanged}
                inactiveFilters={[TransactionFiltersEnum.token]}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
