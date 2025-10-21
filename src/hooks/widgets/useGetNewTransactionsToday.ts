import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { LONG_POOLING_REFRESH_RATE } from 'appConstants';
import { useFetchGrowthHero, useHasGrowthWidgets } from 'hooks';
import { growthHeroSelector, statsSelector } from 'redux/selectors';
import { useGetUpdatedValue } from './useGetUpdatedValue';

export const useGetNewTransactionsToday = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { unprocessed: growthUnprocessed } = useSelector(growthHeroSelector);
  const { unprocessed: statsUnprocessed } = useSelector(statsSelector);
  const { transactions: statsTransactions } = statsUnprocessed;
  const { totalTransactionsToday: growthTransactionsToday } = growthUnprocessed;

  const fetchHero = useFetchGrowthHero();

  const newTransactionsToday = useGetUpdatedValue({
    initialValue: growthTransactionsToday,
    currentValue: statsTransactions
  });

  useEffect(() => {
    if (!hasGrowthWidgets || document.hidden) {
      return;
    }

    const intervalId = setInterval(fetchHero, LONG_POOLING_REFRESH_RATE);
    return () => clearInterval(intervalId);
  }, [hasGrowthWidgets]);

  return newTransactionsToday;
};
