import { UITransactionType, TxActionsEnum, TxActionCategoryEnum } from 'helpers/types';

const getTransactionMethod = (transaction: UITransactionType) => {
  let transactionAction = 'Transaction';
  if (transaction.action && transaction.action.name && transaction.action.category) {
    switch (true) {
      case Boolean(
        transaction.action.category === TxActionCategoryEnum.esdtNft &&
          transaction.action.name === TxActionsEnum.transfer
      ):
        transactionAction = 'Transaction';
        break;
      default:
        transactionAction = transaction.action.name;
        break;
    }

    if (transaction.action.arguments?.functionName) {
      transactionAction = transaction.action.arguments?.functionName;
    }
  }

  return transactionAction;
};

export default getTransactionMethod;
