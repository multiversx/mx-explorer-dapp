import BigNumber from 'bignumber.js';
import { TransactionType } from 'helpers/types';
import denominate from 'sharedComponents/Denominate/denominate';
import { denomination, decimals } from 'appConfig';

const getReceiptValue = (transaction: TransactionType) => {
  if (transaction?.receipt?.value) {
    if (transaction?.receipt?.data && transaction.receipt.data === 'refundedGas') {
      const denominatedGas = denominate({
        input: transaction.receipt.value,
        denomination,
        decimals,
        showLastNonZeroDecimal: true,
      });
      const gasRefunded = new BigNumber(denominatedGas).times(transaction.gasPrice).times(100);

      return gasRefunded.toFixed();
    }

    return transaction.receipt.value;
  }

  return '';
};

export default function getReceiptMessages(transaction: TransactionType) {
  if (transaction?.receipt?.data) {
    const message = transaction.receipt.data;
    const receiptValue = getReceiptValue(transaction);
    const value = receiptValue ? `: ${receiptValue}` : '';

    return [`${message}${value}`];
  } else {
    return [];
  }
}
