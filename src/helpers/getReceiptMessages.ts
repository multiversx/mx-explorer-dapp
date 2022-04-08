import { TransactionType } from 'helpers/types';

export default function getReceiptMessages(transaction: TransactionType) {
  const messages = transaction?.receipt?.data ? [transaction?.receipt?.data] : [];

  return messages;
}
