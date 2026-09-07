import { useSelector } from 'react-redux';

import { growthHeroSelector, statsTransactionsSelector } from 'redux/selectors';
import { useGetUpdatedValue } from './useGetUpdatedValue';
import { useGrowthHeroPoll } from './useGrowthHeroPoll';

export const useGetNewTransactionsToday = () => {
  const { unprocessed: growthUnprocessed } = useSelector(growthHeroSelector);
  const statsTransactions = useSelector(statsTransactionsSelector);
  const { totalTransactionsToday: growthTransactionsToday } = growthUnprocessed;

  const newTransactionsToday = useGetUpdatedValue({
    initialValue: growthTransactionsToday,
    currentValue: statsTransactions
  });

  useGrowthHeroPoll();

  return newTransactionsToday;
};
