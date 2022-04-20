import { TransactionType } from 'helpers/types';

export default function getReceiptMessages(transaction: TransactionType) {
  if (transaction?.receipt?.data) {
    const message = transaction.receipt.data;
    const value = transaction?.receipt?.value ? `: ${transaction.receipt.value}` : '';

    return [`${message}${value}`];
  } else {
    return [];
  }
}
