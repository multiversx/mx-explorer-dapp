import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { LONG_POOLING_REFRESH_RATE } from 'appConstants';
import { useFetchGrowthHero, useHasGrowthWidgets } from 'hooks';
import { growthHeroSelector, statsSelector } from 'redux/selectors';
import { useGetUpdatedValue } from './useGetUpdatedValue';

export const useGetNewAccountsToday = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { unprocessed: growthUnprocessed } = useSelector(growthHeroSelector);
  const { unprocessed: statsUnprocessed } = useSelector(statsSelector);
  const { accounts: statsAccounts } = statsUnprocessed;
  const { activeAccountsToday: growthAccounts } = growthUnprocessed;
  const fetchHero = useFetchGrowthHero();

  const newAccountsToday = useGetUpdatedValue({
    initialValue: growthAccounts,
    currentValue: statsAccounts
  });

  useEffect(() => {
    if (!hasGrowthWidgets || document.hidden) {
      return;
    }

    const intervalId = setInterval(fetchHero, LONG_POOLING_REFRESH_RATE);
    return () => clearInterval(intervalId);
  }, [hasGrowthWidgets]);

  return newAccountsToday;
};
