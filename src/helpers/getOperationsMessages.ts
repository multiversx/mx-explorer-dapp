import { TransactionType } from 'helpers/types';

export default function getOperationsMessages(transaction: TransactionType) {
  const messages =
    transaction?.operations
      ?.map((result) => result.message)
      .filter((messages): messages is string => Boolean(messages)) ?? [];

  return messages;
}
