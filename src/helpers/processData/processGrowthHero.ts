import BigNumber from 'bignumber.js';
import { GrowthHeroType } from 'types';

export const processGrowthHero = (data: GrowthHeroType) => {
  return {
    totalTransactions: new BigNumber(data.totalTransactions).toFormat(0),
    totalTransactionsToday: new BigNumber(data.totalTransactions).toFormat(0),
    totalAccounts: new BigNumber(data.totalTransactions).toFormat(0),
    activeAccountsToday: new BigNumber(data.totalTransactions).toFormat(0)
  };
};
