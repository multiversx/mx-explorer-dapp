import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MAX_RESULTS } from 'appConstants';
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

      map.set(key, (map.get(key) || 0) + 1);
    }

    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([time, count]) => ({
        date: new Date(time),
        count
      }));
  }, [accountTransactions, txCount]);

  return processedHeatmapEntries;
};
