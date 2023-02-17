import {
  UITransactionType,
  TransactionActionEnum,
  TransactionActionCategoryEnum
} from 'types';

export const getTransactionMethod = (transaction: UITransactionType) => {
  let transactionAction = 'transaction';
  if (
    transaction.action &&
    transaction.action.name &&
    transaction.action.category
  ) {
    if (
      transaction.action.category === TransactionActionCategoryEnum.esdtNft &&
      transaction.action.name === TransactionActionEnum.transfer
    ) {
      transactionAction = 'transaction';
    } else {
      transactionAction = transaction.action.name;
    }

    if (transaction.action.arguments?.functionName) {
      transactionAction = transaction.action.arguments?.functionName;
    }
  }
  if (transaction?.function) {
    transactionAction = transaction.function;
  }

  return transactionAction;
};
