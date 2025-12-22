import { useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { chartResolution, MAX_RESULTS } from 'appConstants';
import { formatAmount, formatTimestamp, getRangeDays } from 'helpers';
import { useFetchAccountTransactions } from 'hooks';
import { accountExtraSelector, accountSelector } from 'redux/selectors';
import { ChartResolutionRangeType } from 'types';

export const useGetTransactionFees = () => {
  const { account } = useSelector(accountSelector);
  const { accountExtra } = useSelector(accountExtraSelector);
  const { txCount } = account;
  const { accountTransactions } = accountExtra;

  const [searchParams] = useSearchParams();
  const { range } = Object.fromEntries(searchParams);
  const rangeValue = Object.keys(chartResolution).includes(range)
    ? range
    : 'year';

  useFetchAccountTransactions();

  const processedFeesEntries = useMemo(() => {
    if (accountTransactions.length === 0 || txCount > MAX_RESULTS) {
      return [];
    }

    const nowMs = Date.now();
    const map = new Map();
    const rangeMs =
      getRangeDays(rangeValue as ChartResolutionRangeType) *
      24 *
      60 *
      60 *
      1000;

    for (const tx of accountTransactions) {
      if (range !== 'all' && nowMs - formatTimestamp(tx.timestamp) > rangeMs) {
        continue;
      }

      const formattedTimestamp = formatTimestamp(tx.timestamp);
      const d = new Date(formattedTimestamp);
      const day = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
      );
      const key = day.getTime();

      map.set(
        key,
        new BigNumber(map.get(key) || 0).plus(tx.fee ?? 0).toString()
      );
    }

    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([time, totalFees]) => ({
        timestamp: time,
        value: formatAmount({ input: totalFees })
      }));
  }, [accountTransactions, txCount, rangeValue]);

  return processedFeesEntries;
};
