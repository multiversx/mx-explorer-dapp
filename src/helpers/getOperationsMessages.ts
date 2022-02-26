import { TransactionType } from 'helpers/types';

export default function getOperationsMessages(transaction: TransactionType) {
  const messages =
    transaction?.operations
      ?.map((operation) => operation.message)
      .filter((messages): messages is string => Boolean(messages)) ?? [];

  return messages;
}
