import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSize, useURLSearchParams } from 'hooks';
import { UITransactionType, ApiAdapterResponseType } from 'types';

export const useFetchTransactions = (
  transactionPromise: (params?: any) => Promise<ApiAdapterResponseType>,
  transactionCountPromise: (params?: any) => Promise<ApiAdapterResponseType>,
  filters: any = {}
) => {
  const [searchParams] = useSearchParams();

  const urlParams = useURLSearchParams();
  const { size } = useSize();

  const [transactions, setTransactions] = useState<UITransactionType[]>([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalTransactions, setTotalTransactions] = useState<number | '...'>(
    '...'
  );

  const fetchTransactions = (paramsChange = false) => {
    if (searchParams.toString() && paramsChange) {
      setDataChanged(true);
    }
    Promise.all([
      transactionPromise({ ...urlParams, ...filters, size }),
      transactionCountPromise({ ...urlParams, ...filters })
    ])
      .then(([transactionsData, transactionsCountData]) => {
        if (transactionsData.success && transactionsCountData.success) {
          const existingHashes = transactions.map((b) => b.txHash);
          const newTransactions = transactionsData.data.map(
            (transaction: UITransactionType) => ({
              ...transaction,
              isNew: !existingHashes.includes(transaction.txHash)
            })
          );
          setTransactions(newTransactions);
          setTotalTransactions(Math.min(transactionsCountData.data, 10000));
        }
        setIsDataReady(
          transactionsData.success && transactionsCountData.success
        );
      })
      .finally(() => {
        if (paramsChange) {
          setDataChanged(false);
        }
      });
  };

  return {
    fetchTransactions,
    transactions,
    totalTransactions,
    isDataReady,
    dataChanged
  };
};
