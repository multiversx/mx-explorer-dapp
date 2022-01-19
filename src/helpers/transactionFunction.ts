import { UITransactionType } from 'helpers/types';

const transactionFunction = (transaction: UITransactionType) => {
  let transactionAction = 'Transaction';
  if (transaction.action && transaction.action.name && transaction.action.category) {
    switch (true) {
      case Boolean(
        transaction.action.category === 'esdtNft' && transaction.action.name === 'transfer'
      ):
        transactionAction = 'ESDTNFTTransfer';
        break;
      default:
        transactionAction = transaction.action.name;
        break;
    }
  }

  return transactionAction;
};

export default transactionFunction;
