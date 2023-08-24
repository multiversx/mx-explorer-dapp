import BigNumber from 'bignumber.js';
import { isContract } from 'helpers';
import {
  TransactionType,
  TransactionVisibleOperationEnum,
  TransactionHiddenOperationEnum
} from 'types';

export const getTotalTxTokenUsdValue = (transaction: TransactionType) => {
  if (!transaction?.operations || isContract(transaction.sender)) {
    return new BigNumber(0).toString();
  }

  const allOperationsAreValid = transaction.operations.every(
    (operation) =>
      (operation?.valueUSD !== undefined &&
        transaction.sender === operation.receiver &&
        Object.values<string>(TransactionVisibleOperationEnum).includes(
          operation.type
        )) ||
      Object.values<string>(TransactionHiddenOperationEnum).includes(
        operation.type
      )
  );

  if (!allOperationsAreValid) {
    return new BigNumber(0).toString();
  }

  const totalUsdValue = transaction.operations
    .map((operation) => new BigNumber(operation?.valueUSD ?? 0).toString())
    .reduce(
      (a, b) => new BigNumber(a).plus(new BigNumber(b)),
      new BigNumber(0)
    );

  return totalUsdValue.toString();
};
