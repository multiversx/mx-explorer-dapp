import {
  UITransactionType,
  TransactionActionEnum,
  TransactionActionCategoryEnum
} from 'types';

export const getTransactionMethod = (transaction: UITransactionType) => {
  const transactionAction = 'transaction';

  if (transaction?.function) {
    return transaction.function;
  }

  if (transaction.action?.name && transaction.action?.category) {
    if (
      transaction.action.category ===
      TransactionActionCategoryEnum.deprecatedRelayedV1V2
    ) {
      return transactionAction;
    }

    if (transaction.action.arguments?.functionName) {
      return transaction.action.arguments?.functionName;
    }

    if (
      transaction.action.category === TransactionActionCategoryEnum.esdtNft &&
      transaction.action.name === TransactionActionEnum.transfer
    ) {
      return transactionAction;
    }

    return transaction.action.name;
  }

  return transactionAction;
};
