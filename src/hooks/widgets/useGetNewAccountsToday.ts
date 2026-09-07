import { useSelector } from 'react-redux';

import { growthHeroSelector, statsAccountsSelector } from 'redux/selectors';
import { useGetUpdatedValue } from './useGetUpdatedValue';
import { useGrowthHeroPoll } from './useGrowthHeroPoll';

export const useGetNewAccountsToday = () => {
  const { unprocessed: growthUnprocessed } = useSelector(growthHeroSelector);
  const statsAccounts = useSelector(statsAccountsSelector);
  const { activeAccountsToday: growthAccounts } = growthUnprocessed;

  const newAccountsToday = useGetUpdatedValue({
    initialValue: growthAccounts,
    currentValue: statsAccounts
  });

  useGrowthHeroPoll();

  return newAccountsToday;
};
