import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable } from 'components';
import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { useAdapter, useSize, useURLSearchParams } from 'hooks';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { UITransactionType } from 'types';

import { TokenTabs } from './TokenLayout/TokenTabs';

export const TokenDetails = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { transactions: transactionsCount } = token;

  const { getTokenTransfers, getTokenTransfersCount } = useAdapter();

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
  const { hash: tokenId } = useParams();

  const [transactions, setTransactions] = useState<UITransactionType[]>([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalTransactions, setTotalTransactions] = useState<number | '...'>(
    '...'
  );

  const fetchTransactions = (paramsChange = false) => {
    if (tokenId) {
      if (searchParams.toString() && paramsChange) {
        setDataChanged(true);
      }
      Promise.all([
        getTokenTransfers({
          size,
          tokenId,

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
        getTokenTransfersCount({
          size,
          tokenId,

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
  }, [activeNetworkId, tokenId, transactionsCount]);

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
                directionCol={true}
                title={<TokenTabs />}
                dataChanged={dataChanged}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
