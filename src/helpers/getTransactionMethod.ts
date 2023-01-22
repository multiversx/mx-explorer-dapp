import { UITransactionType, TxActionsEnum, TxActionCategoryEnum } from 'types';

export const getTransactionMethod = (transaction: UITransactionType) => {
  let transactionAction = 'transaction';
  if (transaction.action && transaction.action.name && transaction.action.category) {
    if (
      transaction.action.category === TxActionCategoryEnum.esdtNft &&
      transaction.action.name === TxActionsEnum.transfer
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
