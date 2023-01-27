import BigNumber from 'bignumber.js';
import { GrowthHeroType } from 'types';

export const processGrowthHero = (data: GrowthHeroType) => {
  return {
    totalTransactions: new BigNumber(data.totalTransactions).toFormat(0),
    totalTransactionsToday: new BigNumber(data.totalTransactionsToday).toFormat(
      0
    ),
    totalAccounts: new BigNumber(data.totalAccounts).toFormat(0),
    activeAccountsToday: new BigNumber(data.activeAccountsToday).toFormat(0)
  };
};
