import { TransactionType, TransactionVisibleOperationEnum } from 'types';

export const getTransactionVisibleOperations = (
  transaction: TransactionType
) => {
  const operations =
    transaction?.operations?.filter((operation) =>
      Object.values<string>(TransactionVisibleOperationEnum).includes(
        operation.type
      )
    ) ?? [];

  return operations;
};
