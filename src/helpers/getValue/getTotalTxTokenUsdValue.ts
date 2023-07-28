import BigNumber from 'bignumber.js';
import { TransactionType } from 'types';

export const getTotalTxTokenUsdValue = (transaction: TransactionType) => {
  if (!transaction?.operations) {
    return '';
  }

  const userArray = [transaction.sender, transaction.receiver];

  const totalUsdValue = transaction.operations
    .map((operation) => {
      const { valueUSD } = operation;

      if (valueUSD) {
        const operationArray = [operation.sender, operation.receiver];
        const isUserInvolved =
          [
            ...Array.from(
              new Set(userArray.filter((i) => operationArray.includes(i)))
            )
          ].length > 0;

        if (isUserInvolved) {
          return valueUSD;
        }
      }
      return '0';
    })
    .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber('0'));

  return totalUsdValue.toNumber();
};
