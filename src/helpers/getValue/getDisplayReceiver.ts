import { UITransactionType } from 'types';

export const getDisplayReceiver = (transaction: UITransactionType) => {
  if (
    transaction.sender === transaction.receiver &&
    transaction?.action?.arguments?.receiver &&
    transaction?.action?.arguments?.receiver !== transaction.receiver
  ) {
    return {
      receiver: transaction.action.arguments.receiver,
      receiverAssets: transaction?.action?.arguments?.receiverAssets
    };
  }

  return {
    receiver: transaction.receiver,
    receiverAssets: transaction?.receiverAssets
  };
};
