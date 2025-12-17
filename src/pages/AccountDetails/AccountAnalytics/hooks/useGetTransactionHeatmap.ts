import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { formatTimestamp } from 'helpers';
import { useFetchAccountTransactions } from 'hooks';
import { accountExtraSelector } from 'redux/selectors';

export const useGetTransactionHeatmap = () => {
  const { accountExtra } = useSelector(accountExtraSelector);
  const { accountTransactions } = accountExtra;

  useFetchAccountTransactions();

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
      const key = day.getTime();

      map.set(key, (map.get(key) || 0) + 1);
    }

    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([time, count]) => ({
        date: new Date(time),
        count
      }));
  }, [accountTransactions]);

  return processedHeatmapEntries;
};
