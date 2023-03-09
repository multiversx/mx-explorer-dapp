import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { Loader, TransactionsTable } from 'components';
import { FailedTransactions } from 'components/TransactionsTable/FailedTransactions';
import { useAdapter, useSize, useURLSearchParams } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { UITransactionType, TransactionFiltersEnum } from 'types';

import { ProviderTabs } from './ProviderLayout/ProviderTabs';

export const ProviderTransactions = () => {
  const ref = useRef(null);
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getTransactions, getTransactionsCount } = useAdapter();

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
    token
  } = useURLSearchParams();
  const { size } = useSize();
  const { hash: address } = useParams();

  const [transactions, setTransactions] = useState<UITransactionType[]>([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalTransactions, setTotalTransactions] = useState<number | '...'>(
    '...'
  );

  const inactiveFilters = [
    TransactionFiltersEnum.sender,
    TransactionFiltersEnum.receiver
  ];

  const fetchTransactions = (paramsChange = false) => {
    if (searchParams.toString() && paramsChange) {
      setDataChanged(true);
    }
    Promise.all([
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
        token,
        withUsername: true
      }),
      getTransactionsCount({
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
        token
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
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeNetworkId, address]);

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
                address={address}
                totalTransactions={totalTransactions}
                size={size}
                showDirectionCol={true}
                title={<ProviderTabs />}
                inactiveFilters={inactiveFilters}
                dataChanged={dataChanged}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
