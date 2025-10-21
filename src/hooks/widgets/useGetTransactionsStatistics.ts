import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { formatBigNumber, getColors } from 'helpers';
import { useFetchGrowthTransactions } from 'hooks';
import { growthTransactionsSelector, statsSelector } from 'redux/selectors';
import { StatisticType, TransactionsStatisticsLabelEnum } from 'types';

export const useGetTransactionsStatistics = ({
  showTotal = true,
  customStatistics = []
}: {
  customStatistics?: StatisticType[];
  showTotal?: boolean;
}) => {
  const [success, primary, violet500] = getColors([
    'success',
    'primary',
    'violet-500'
  ]);

  const { transactions, unprocessed: unprocessedGrowth } = useSelector(
    growthTransactionsSelector
  );
  const { unprocessed: unprocessedStats } = useSelector(statsSelector);

  const liveScResults = useMemo(() => {
    if (unprocessedStats.scResults) {
      return unprocessedStats.scResults;
    }

    return unprocessedGrowth.scResults;
  }, [unprocessedStats.scResults, unprocessedGrowth.scResults]);

  const liveTotalTransactions = useMemo(() => {
    if (unprocessedStats.transactions) {
      return unprocessedStats.transactions;
    }

    return unprocessedGrowth.totalTransactions;
  }, [unprocessedStats.transactions, unprocessedGrowth.totalTransactions]);

  const liveNormalTransactions = useMemo(() => {
    if (new BigNumber(liveTotalTransactions).isGreaterThan(liveScResults)) {
      return new BigNumber(liveTotalTransactions).minus(liveScResults);
    }

    return transactions;
  }, [liveTotalTransactions, liveScResults, transactions]);

  const statistics = useMemo(() => {
    if (customStatistics.length > 0) {
      return customStatistics;
    }

    return [
      {
        label: TransactionsStatisticsLabelEnum.Transactions,
        value: formatBigNumber({
          value: liveTotalTransactions,
          showEllipsisIfZero: true
        }),
        color: primary
      },
      {
        label: TransactionsStatisticsLabelEnum.Applications,
        value: formatBigNumber({
          value: liveScResults,
          showEllipsisIfZero: true
        }),
        color: showTotal ? success : primary
      },
      {
        label: TransactionsStatisticsLabelEnum.Standard,
        value: formatBigNumber({
          value: liveNormalTransactions,
          showEllipsisIfZero: true
        }),
        color: violet500
      }
    ];
  }, [
    customStatistics,
    liveTotalTransactions,
    liveScResults,
    liveNormalTransactions,
    showTotal
  ]);

  useFetchGrowthTransactions();

  return statistics;
};
