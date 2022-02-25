import { TransactionType } from 'helpers/types';

export default function getScResultsMessages(transaction: TransactionType) {
  if (transaction.results) {
    const messages = transaction.results.map((result) => result.returnMessage);

    return messages.filter((messages): messages is string => Boolean(messages));
  }

  return [];
}
