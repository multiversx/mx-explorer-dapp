import { useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { useSelector } from 'react-redux';

import { formatAmount, formatTimestamp } from 'helpers';
import { useFetchAccountTransactions } from 'hooks';
import { accountExtraSelector } from 'redux/selectors';

export const useGetTransactionFees = () => {
  const { accountExtra } = useSelector(accountExtraSelector);
  const { accountTransactions } = accountExtra;

  useFetchAccountTransactions();

  const processedFeesEntries = useMemo(() => {
    if (accountTransactions.length === 0) {
      return [];
    }

    const map = new Map();

    for (const tx of accountTransactions) {
      const d = new Date(formatTimestamp(tx.timestamp));
      const day = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      ).valueOf();

      map.set(
        day,
        new BigNumber(map.get(day) || 0).plus(tx.fee ?? 0).toString()
      );
    }

    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([timestamp, totalFees]) => ({
        timestamp,
        value: formatAmount({ input: totalFees })
      }));
  }, [accountTransactions]);

  return processedFeesEntries;
};
