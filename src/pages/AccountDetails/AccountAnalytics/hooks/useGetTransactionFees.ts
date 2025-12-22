import { useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { useSelector } from 'react-redux';

import { MAX_RESULTS } from 'appConstants';
import { formatAmount, formatTimestamp } from 'helpers';
import { useFetchAccountTransactions } from 'hooks';
import { accountExtraSelector, accountSelector } from 'redux/selectors';

export const useGetTransactionFees = () => {
  const { account } = useSelector(accountSelector);
  const { accountExtra } = useSelector(accountExtraSelector);
  const { txCount } = account;
  const { accountTransactions } = accountExtra;

  useFetchAccountTransactions();

  const processedFeesEntries = useMemo(() => {
    if (accountTransactions.length === 0 || txCount > MAX_RESULTS) {
      return [];
    }

    const map = new Map();

    for (const entry of accountTransactions) {
      const formattedTimestamp = formatTimestamp(entry.timestamp);
      const d = new Date(formattedTimestamp);
      const day = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      );
      const key = day.getTime();

      map.set(
        key,
        new BigNumber(map.get(key) || 0).plus(entry.fee ?? 0).toString()
      );
    }

    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([time, totalFees]) => ({
        timestamp: time,
        value: formatAmount({ input: totalFees })
      }));
  }, [accountTransactions, txCount]);

  return processedFeesEntries;
};
