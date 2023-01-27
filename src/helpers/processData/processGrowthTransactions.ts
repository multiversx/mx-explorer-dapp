import BigNumber from 'bignumber.js';
import { GrowthTransactionsType } from 'types';

export const processGrowthTransactions = (data: GrowthTransactionsType) => {
  return {
    totalTransactions: new BigNumber(data.totalTransactions).toFormat(0),
    scResults: new BigNumber(data.scResults).toFormat(0),
    transactions: new BigNumber(data.transactions).toFormat(0)
  };
};
