import { TransactionType } from 'helpers/types';

export default function getOperationsMessages(transaction: TransactionType) {
  const messages: string[] = [];

  if (transaction.operations) {
    transaction.operations.forEach((operation) => {
      if (operation.message) {
        messages.push(operation.message);
      }
    });
  }

  return messages;
}
