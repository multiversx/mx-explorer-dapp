import { TransactionType } from 'helpers/types';

export default function getScResultsMessages(transaction: TransactionType) {
  const messages: string[] = [];

  if (transaction.results) {
    transaction.results.forEach((result) => {
      if (result.returnMessage) {
        messages.push(result.returnMessage);
      }
    });
  }

  return messages;
}
