import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { formatTimestamp } from 'helpers';
import { accountExtraSelector } from 'redux/selectors';
import { useGetAccountTransactions } from './useGetAccountTransactions';

export const useGetTransactionHeatmap = () => {
  const { accountExtra } = useSelector(accountExtraSelector);
  const { accountTransactions } = accountExtra;

  useGetAccountTransactions();

  const processedHeatmapEntries = useMemo(() => {
    if (accountTransactions.length === 0) {
      return [];
    }

    const map = new Map();

    for (const entry of accountTransactions) {
      const formattedTimestamp = formatTimestamp(entry.timestamp);
      const d = new Date(formattedTimestamp);

      const day = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      );

      const key = day.getTime(); // numeric key for the Map

      map.set(key, (map.get(key) || 0) + 1);
    }

    // Convert Map back to sorted array
    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([time, count]) => ({
        date: new Date(time),
        count
      }));
  }, [accountTransactions]);

  return processedHeatmapEntries;
};
