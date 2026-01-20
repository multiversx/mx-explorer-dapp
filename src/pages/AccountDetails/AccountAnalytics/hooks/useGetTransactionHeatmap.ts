import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { formatTimestamp } from 'helpers';
import { useFetchAccountTransactions } from 'hooks';
import { accountExtraSelector, accountSelector } from 'redux/selectors';

export const useGetTransactionHeatmap = () => {
  const { account } = useSelector(accountSelector);
  const { accountExtra } = useSelector(accountExtraSelector);
  const { txCount } = account;
  const { accountTransactions } = accountExtra;

  useFetchAccountTransactions();

  const processedHeatmapEntries = useMemo(() => {
    const map = new Map();

    for (const entry of accountTransactions) {
      const d = new Date(formatTimestamp(entry.timestamp));
      const day = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      ).valueOf();

      map.set(day, (map.get(day) || 0) + 1);
    }

    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([timestamp, value]) => ({
        timestamp,
        value
      }));
  }, [accountTransactions, txCount]);

  return processedHeatmapEntries;
};
