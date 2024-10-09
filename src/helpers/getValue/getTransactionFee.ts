import BigNumber from 'bignumber.js';
import { TransactionType } from 'types';

export const getTransactionFee = (transaction: TransactionType) => {
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const fee = bNgasPrice.times(bNgasUsed).toString();

  return fee;
};
