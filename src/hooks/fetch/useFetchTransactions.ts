import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import { useGetPage, useGetTransactionFilters } from 'hooks';
import { UITransactionType, ApiAdapterResponseType } from 'types';

export const useFetchTransactions = (
  transactionPromise: (params?: any) => Promise<ApiAdapterResponseType>,
  transactionCountPromise: (params?: any) => Promise<ApiAdapterResponseType>,
  filters: any = {}
) => {
  const [searchParams] = useSearchParams();

  const urlParams = useGetTransactionFilters();
  const { page } = useGetPage();

  const [transactions, setTransactions] = useState<UITransactionType[]>([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalTransactions, setTotalTransactions] = useState<
    number | typeof ELLIPSIS
  >(ELLIPSIS);
  let isCalled = false;

  const fetchTransactions = (paramsChange = false) => {
    if (!isCalled) {
      isCalled = true;
      if (searchParams.toString() && paramsChange) {
        setDataChanged(true);
      }
      Promise.all([
        transactionPromise({ ...urlParams, ...filters, page }),
        transactionCountPromise({ ...urlParams, ...filters })
      ])
        .then(([transactionsData, transactionsCountData]) => {
          if (transactionsData.success && transactionsCountData.success) {
            const existingHashes = transactions.map((b) => b.txHash);
            const newTransactions = transactionsData.data.map(
              (transaction: UITransactionType) => ({
                ...transaction,
                isNew:
                  page === 1 && !existingHashes.includes(transaction.txHash)
              })
            );
            setTransactions(newTransactions);
            setTotalTransactions(transactionsCountData.data);
          }
          setIsDataReady(
            transactionsData.success && transactionsCountData.success
          );
        })
        .finally(() => {
          if (paramsChange) {
            isCalled = false;
            setDataChanged(false);
          }
        });
    }
  };

  return {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  };
};
