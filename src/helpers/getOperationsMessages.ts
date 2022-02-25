import { TransactionType } from 'helpers/types';

export default function getOperationsMessages(transaction: TransactionType) {
  if (transaction.operations) {
    const messages = transaction.operations.map((result) => result.message);

    return messages.filter((messages): messages is string => Boolean(messages));
  }

  return [];
}
